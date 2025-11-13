import * as jwt from 'jsonwebtoken';
import { randomUUID } from 'crypto';

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET || "access_secret";
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET || "refresh_secret";

export const generateAccessToken = (userid: string, expiresIn: string = '15m'): string => {
    // Explicitly cast secret and options to jwt types to satisfy TypeScript overloads
    return jwt.sign({ id: userid }, ACCESS_TOKEN_SECRET as jwt.Secret, { expiresIn } as jwt.SignOptions);
};

// Include a unique jti claim in refresh tokens to avoid accidental token collisions
export const generateRefreshToken = (userid: string, expiresIn: string = '7d'): string => {
    const jti = randomUUID();
    return jwt.sign({ id: userid, jti }, REFRESH_TOKEN_SECRET as jwt.Secret, { expiresIn } as jwt.SignOptions);
};

export const verifyAccessToken = (token: string): object | null => {
    try {
        return jwt.verify(token, ACCESS_TOKEN_SECRET as jwt.Secret) as object;
    } catch {
        return null;
    }
};

export const verifyRefreshToken = (token: string): object | null => {
    try {
        return jwt.verify(token, REFRESH_TOKEN_SECRET as jwt.Secret) as object;
    } catch {
        return null;
    }
};
