import { Request, Response, NextFunction } from "express";
import { verifyAccessToken } from "../utils/jwt";


interface AuthRequest extends Request {
    userId?: string;
}

export const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ error: "Authorization header missing" });

    const token = authHeader.split(' ')[1];
    if (!token) return res.status(401).json({ error: "Token missing" });

    try {
        const payload = verifyAccessToken(token);
        req.userId = (payload as any).id;
        next();
    } catch (err) {
        return res.status(401).json({ error: "Invalid or expired token" });
    }
};