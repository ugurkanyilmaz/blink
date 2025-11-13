import { prisma } from "../prisma/client";

interface UpdateUserData {
  alias?: string;
  alias_tag?: string;
  location_lat?: number;
  location_lon?: number;
  is_active?: boolean;
  completed?: boolean;
}

export const getUserById = async (userId: string) => {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw new Error("Kullanıcı bulunamadı");
  return user;
};

export const updateUser = async (userId: string, data: UpdateUserData) => {
  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data,
  });
  return updatedUser;
};
