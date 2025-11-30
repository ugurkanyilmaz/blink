import redis from "../config/redis";
import prisma from "../config/db";

export const matchService = {
  async addResponderToPool(socketId: string, userId: string, lat: number, lon: number, age: number, gender: string) {
    // 1. GEOADD: Add user to geospatial index for proximity search
    // Syntax: key, longitude, latitude, member
    await redis.geoadd('pool:locations', lon, lat, socketId);

    // 2. HSET: Store metadata for quick access during scoring
    await redis.hset(`responder:${socketId}`, {
      userId,
      age: age.toString(),
      gender,
      joinedAt: Date.now().toString(),
    });

    // 3. Map socket to user for quick lookup
    await redis.set(`socket:user:${socketId}`, userId);
  },

  async removeResponderFromPool(socketId: string) {
    await redis.zrem('pool:locations', socketId);
    await redis.del(`responder:${socketId}`);
    await redis.del(`socket:user:${socketId}`);
  },

  async findMatch(requesterId: string, lat: number, lon: number, myAge: number) {
    // 1. Get Candidates: Find up to 300 users within 300km
    const candidates = await redis.georadius(
      'pool:locations',
      lon,
      lat,
      300,
      'km',
      'WITHDIST',
      'COUNT',
      300,
      'ASC'
    ) as [string, string][]; // [socketId, distance][]

    if (!candidates || candidates.length === 0) {
      return null;
    }

    // 2. Bulk DB Fetch: Get requester's match history for the last 30 days
    // This avoids N+1 queries inside the loop
    const pastMatches = await prisma.match.findMany({
      where: {
        OR: [{ userAId: requesterId }, { userBId: requesterId }],
        createdAt: { gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }
      },
      select: { userAId: true, userBId: true, createdAt: true }
    });

    // Create a quick lookup map: PartnerID -> LastMatchDate
    const historyMap = new Map<string, Date>();
    pastMatches.forEach(m => {
      const partnerId = m.userAId === requesterId ? m.userBId : m.userAId;
      // Keep the most recent date if multiple exist
      if (!historyMap.has(partnerId) || historyMap.get(partnerId)! < m.createdAt) {
        historyMap.set(partnerId, m.createdAt);
      }
    });

    // 3. Redis Pipeline: Fetch metadata for all candidates in one go
    const pipeline = redis.pipeline();
    candidates.forEach(([socketId]) => {
      pipeline.hgetall(`responder:${socketId}`);
    });
    const metadatas = await pipeline.exec();

    if (!metadatas) {
      return null;
    }

    // 4. Scoring Loop
    let bestMatch: { socketId: string; userId: string; score: number } | null = null;
    let maxScore = -Infinity;

    for (let i = 0; i < candidates.length; i++) {
      const [socketId, distanceStr] = candidates[i];
      const distance = parseFloat(distanceStr);

      // Handle Redis pipeline result
      const result = metadatas[i];
      const err = result[0];
      const data = result[1] as { userId: string; age: string; gender: string; joinedAt: string };

      if (err || !data || !data.userId) continue;
      if (data.userId === requesterId) continue; // Should not happen but safety check

      // --- SCORING FORMULA ---

      // A. Distance Score (Max 100)
      // Closer is better. 0km = 100pts, 100km+ = 0pts
      const distanceScore = Math.max(0, 100 - distance);

      // B. Age Score (Max 50)
      // Similar age is better. 0 diff = 50pts, 10 diff = 0pts
      const candidateAge = parseInt(data.age || '25');
      const ageDiff = Math.abs(myAge - candidateAge);
      const ageScore = Math.max(0, 50 - (ageDiff * 5));

      // C. Wait Time Score (Max 50)
      // Longer wait = higher priority. 10 mins = 50pts
      const joinedAt = parseInt(data.joinedAt || Date.now().toString());
      const waitMinutes = (Date.now() - joinedAt) / 60000;
      const waitScore = Math.min(50, waitMinutes * 5);

      // D. Penalty (History)
      let penalty = 0;
      if (historyMap.has(data.userId)) {
        const lastMatchDate = historyMap.get(data.userId)!;
        const hoursAgo = (Date.now() - lastMatchDate.getTime()) / 3600000;

        if (hoursAgo < 24) continue; // Hard block: Matched in last 24h
        if (hoursAgo < 168) penalty = 50; // 1 week: High penalty
        else penalty = 10; // 1 month: Low penalty
      }

      const totalScore = distanceScore + ageScore + waitScore - penalty;

      // Debug Logging for Verification
      if (totalScore > 50) { // Only log good candidates to avoid spam
        console.log(`[MatchAlgo] Candidate ${data.userId} | Dist: ${distance.toFixed(1)}km (${distanceScore.toFixed(0)}pts) | Age: ${candidateAge} (${ageScore.toFixed(0)}pts) | Wait: ${waitMinutes.toFixed(1)}m (${waitScore.toFixed(0)}pts) | Total: ${totalScore.toFixed(0)}`);
      }

      if (totalScore > maxScore) {
        maxScore = totalScore;
        bestMatch = {
          socketId,
          userId: data.userId,
          score: totalScore
        };
      }
    }

    if (!bestMatch) {
      return null;
    }

    // 5. Execute Match
    const partnerSocketId = bestMatch.socketId;
    const partnerUserId = bestMatch.userId;

    // Create Match record
    const match = await prisma.match.create({
      data: {
        userAId: requesterId,
        userBId: partnerUserId,
        status: 'accepted',
      },
    });

    // Cleanup Responder
    await this.removeResponderFromPool(partnerSocketId);

    return {
      matchId: match.id,
      partnerSocketId,
      partnerUserId,
      roomId: match.id,
    };
  }
};
