import { PrismaClient, User } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

export interface IUserInput {
    username: string;
    password: string;
}

export const createUser = async ({ username, password }: IUserInput): Promise<User> => {
    const hashedPassword = await bcrypt.hash(password, 10);
    return prisma.user.create({
        data: {
            username,
            password: hashedPassword,
        },
    });
};

export const findUserByUsername = async (username: string): Promise<User | null> => {
    return prisma.user.findUnique({
        where: { username },
    });
};

export const validatePassword = async (plainPassword: string, hashedPassword: string): Promise<boolean> => {
    return bcrypt.compare(plainPassword, hashedPassword);
};

// Reiniciar contraseña
export const resetPassword = async (userId: string, newPassword: string): Promise<User | null> => {
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    return prisma.user.update({
        where: { id: userId },
        data: { password: hashedPassword },
    });
};