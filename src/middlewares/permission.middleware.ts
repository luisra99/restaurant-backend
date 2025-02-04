import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const authorize = (action: string) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { user: { username } } = req.body;
            if (!username) {
                return res.status(401).json({ message: 'User not found' });
            }

            const userData = await prisma.user.findUnique({
                where: { username }, select: { permissions: true }
            })

            if (!userData) {
                return res.status(401).json({ message: 'User not found' });
            }
           // const userPermissions = new Set([
           //     ...userData.permissions
           // ]);

           // if (!userPermissions.has(action)) {
           //     return res.status(401).json({ message: `Permission denied for ${username}` });
           // }

            next();
        } catch (error) {
            console.log(error)
            return res.status(401).json({ message: 'Unauthorized', stack: error });
        }
    };
};