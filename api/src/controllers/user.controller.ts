import { Request, Response } from "express";
import * as userService from "../services/user.service";

export const getMe = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;
    if (!userId) return res.status(401).json({ message: 'Unauthorized' });
    const user = await userService.getUserById(userId);
    // Exclude sensitive fields before sending the user object
    if (user) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...safeUser } = user as any;
      return res.json(safeUser);
    }
    res.json(user);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

export const updateMe = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;
    if (!userId) return res.status(401).json({ message: 'Unauthorized' });
    const { alias, alias_tag, location_lat, location_lon, is_active, completed } = req.body;

    const updatedUser = await userService.updateUser(userId, {
      alias,
      alias_tag,
      location_lat,
      location_lon,
      is_active,
      completed,
    });

    // Exclude sensitive fields from the response
    if (updatedUser) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...safeUser } = updatedUser as any;
      return res.json(safeUser);
    }

    res.json(updatedUser);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};
