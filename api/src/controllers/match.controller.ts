import { Request, Response } from 'express';
import prisma from '../config/db';

export const getMatches = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });

    const matches = await prisma.match.findMany({
      where: {
        OR: [{ userAId: userId }, { userBId: userId }],
        status: 'accepted',
      },
      include: {
        userA: { select: { id: true, alias: true, alias_tag: true } },
        userB: { select: { id: true, alias: true, alias_tag: true } },
      },
      orderBy: { updatedAt: 'desc' },
    });

    // Format matches for frontend
    const formattedMatches = matches.map(match => {
      const partner = match.userAId === userId ? match.userB : match.userA;
      return {
        id: match.id,
        partner,
        updatedAt: match.updatedAt,
      };
    });

    res.json(formattedMatches);
  } catch (error) {
    console.error('Get matches error:', error);
    res.status(500).json({ error: 'Failed to fetch matches' });
  }
};
