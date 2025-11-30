import { Request, Response } from 'express';
import prisma from '../config/db';

export const getProfile = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        phone: true,
        alias: true,
        alias_tag: true,
        location_lat: true,
        location_lon: true,
        completed: true,
        birthDate: true,
        createdAt: true,
      },
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
};

export const updateProfile = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    const { alias, alias_tag, location_lat, location_lon, birthDate } = req.body;

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Validation
    if (!alias || alias.trim().length < 2) {
      return res.status(400).json({ error: 'Alias must be at least 2 characters' });
    }

    if (!alias_tag || alias_tag.trim().length < 2) {
      return res.status(400).json({ error: 'Alias tag must be at least 2 characters' });
    }

    if (!location_lat || !location_lon) {
      return res.status(400).json({ error: 'Location is required' });
    }

    if (!birthDate) {
      return res.status(400).json({ error: 'Birth date is required' });
    }

    const birthDateObj = new Date(birthDate);
    if (isNaN(birthDateObj.getTime())) {
      return res.status(400).json({ error: 'Invalid birth date format' });
    }

    // Check if all required fields are provided to mark profile as completed
    const completed = !!(alias && alias_tag && location_lat && location_lon && birthDate);

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        alias: alias.trim(),
        alias_tag: alias_tag.trim(),
        location_lat: parseFloat(location_lat),
        location_lon: parseFloat(location_lon),
        birthDate: birthDateObj,
        completed,
      },
      select: {
        id: true,
        phone: true,
        alias: true,
        alias_tag: true,
        location_lat: true,
        location_lon: true,
        completed: true,
        birthDate: true,
        createdAt: true,
      },
    });

    res.json(updatedUser);
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ error: 'Failed to update profile' });
  }
};
