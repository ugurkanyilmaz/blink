import { Request, Response } from 'express';
import * as authService from '../services/auth.service';

export const register = async (req: Request, res: Response) => {
    try {
        const { phone, password } = req.body;
        const result = await authService.register(phone, password);
        // Exclude sensitive fields from returned user
        const { user, accessToken, refreshToken } = result as any;
        const { password: _pwd, ...safeUser } = user;
        res.status(201).json({ user: safeUser, accessToken, refreshToken });
    } catch (err: any) {
        console.error('Register error:', err);
        res.status(400).json({ error: err.message });
    }
};


export const login = async (req: Request, res: Response) => {
    try {
        const { phone, password } = req.body;
        const result = await authService.login(phone, password);
        const { user, accessToken, refreshToken } = result as any;
        const { password: _pwd, ...safeUser } = user;
        res.status(200).json({ user: safeUser, accessToken, refreshToken });
    } catch (err: any) {
        console.error('Login error:', err);
        res.status(401).json({ error: err.message });
    }
};


export const refresh = async (req: Request, res: Response) => {
    try {
        const { refreshToken } = req.body;
        const result = await authService.refresh(refreshToken);
        res.status(200).json(result);
    } catch (err: any) {
        res.status(401).json({ error: err.message });
    }
};

export const logout = async (req: Request, res: Response) => {
    try {
        const { refreshToken } = req.body;
        const result = await authService.logout(refreshToken);
        res.status(200).json(result);
    } catch (err: any) {
        res.status(401).json({ error: err.message });
    }
};
