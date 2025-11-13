import bcrypt from "bcryptjs";
import { prisma } from "../prisma/client";
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from "../utils/jwt";

export const register = async (phone: string, password: string) => {
  const existingUser = await prisma.user.findUnique({ where: { phone } });
  if (existingUser) throw new Error("Bu telefon numarası zaten kayıtlı");

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: { phone, password: hashedPassword },
  });

  const accessToken = generateAccessToken(user.id);

  // Generate and persist a refresh token with retry on unique-token collisions
  let refreshToken = '';
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 7);
  const maxAttempts = 5;
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      refreshToken = generateRefreshToken(user.id);
      await prisma.refreshToken.create({ data: { userId: user.id, token: refreshToken, expiresAt } });
      break; // success
    } catch (e: any) {
      // If token uniqueness collision, retry generating a new token
      if (e?.code === 'P2002' && attempt < maxAttempts) {
        continue;
      }
      throw e;
    }
  }

  return { user, accessToken, refreshToken };
};

export const login = async (phone: string, password: string) => {
  const user = await prisma.user.findUnique({ where: { phone } });
  if (!user) throw new Error("Kullanıcı bulunamadı");

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new Error("Şifre yanlış");

  const accessToken = generateAccessToken(user.id);
  // Generate and persist a refresh token with retry on unique-token collisions
  let refreshToken = '';
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 7);
  const maxAttemptsLogin = 5;
  for (let attempt = 1; attempt <= maxAttemptsLogin; attempt++) {
    try {
      refreshToken = generateRefreshToken(user.id);
      await prisma.refreshToken.create({ data: { userId: user.id, token: refreshToken, expiresAt } });
      break;
    } catch (e: any) {
      if (e?.code === 'P2002' && attempt < maxAttemptsLogin) {
        continue;
      }
      throw e;
    }
  }

  return { user, accessToken, refreshToken };
};

export const refresh = async (token: string) => {
  const storedToken = await prisma.refreshToken.findUnique({ where: { token } });
  if (!storedToken) throw new Error("Refresh token geçersiz");

  if (storedToken.expiresAt < new Date()) {
    await prisma.refreshToken.delete({ where: { token } });
    throw new Error("Refresh token süresi dolmuş");
  }

  const payload = verifyRefreshToken(token);
  if (!payload || typeof (payload as any).id !== 'string') {
    throw new Error('Invalid refresh token payload');
  }

  const newAccessToken = generateAccessToken((payload as any).id as string);

  return { accessToken: newAccessToken };
};

export const logout = async (token: string) => {
  await prisma.refreshToken.deleteMany({ where: { token } });
  return { message: "Çıkış yapıldı" };
};
