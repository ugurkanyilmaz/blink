import { Server, Socket } from "socket.io";
import { matchService } from "../services/match.service";

import prisma from "../config/db";

export const handleMatchSocket = (io: Server, socket: Socket) => {

  socket.on('join_pool', async (data: { userId: string }) => {
    const { userId } = data;

    try {
      // Fetch user details for matchmaking
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
          location_lat: true,
          location_lon: true,
          birthDate: true,
          // gender: true // Assuming gender is added to schema later, for now we can mock or infer
        }
      });

      if (!user || !user.location_lat || !user.location_lon) {
        socket.emit('error', { message: 'Location required for matching' });
        return;
      }

      // Calculate age
      let age = 25; // Default
      if (user.birthDate) {
        const diff = Date.now() - new Date(user.birthDate).getTime();
        age = Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25));
      }

      // Role distribution (30% Requester, 70% Responder)
      const isRequester = Math.random() < 0.3;
      const role = isRequester ? 'requester' : 'responder';

      // Tell the outcome
      socket.emit('role_assigned', { role });

      // If responder, add to pool
      if (role === 'responder') {
        await matchService.addResponderToPool(
          socket.id,
          userId,
          user.location_lat,
          user.location_lon,
          age,
          'unknown' // Gender placeholder
        );
        socket.emit('waiting_in_pool', { message: 'Waiting for a match' });
      }

      // If requester, start matching
      else {
        try {
          const matchResult = await matchService.findMatch(
            userId,
            user.location_lat,
            user.location_lon,
            age
          );

          if (matchResult) {
            const { roomId, matchId, partnerSocketId, partnerUserId } = matchResult;

            // Join both users to the room
            socket.join(roomId);
            const partnerSocket = io.sockets.sockets.get(partnerSocketId);
            if (partnerSocket) {
              partnerSocket.join(roomId);
            }

            // Notify both users
            io.to(roomId).emit('match_found', {
              roomId,
              matchId,
              requesterId: userId,
              responderId: partnerUserId,
              role: 'requester' // This user is the requester
            });

          } else {
            // No match found
            socket.emit('no_match_found', { message: 'No available responders at the moment.' });
          }
        } catch (error) {
          console.error('Match creation failed:', error);
          socket.emit('error', { message: 'Match creation failed' });
        }
      }
    } catch (error) {
      console.error('Join pool error:', error);
      socket.emit('error', { message: 'Failed to join pool' });
    }
  });

  // Handle disconnect
  socket.on('disconnect', async () => {
    await matchService.removeResponderFromPool(socket.id);
  });
};
