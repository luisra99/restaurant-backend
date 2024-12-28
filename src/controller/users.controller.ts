import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const listUsers = async (req: Request, res: Response) => {
    try {
        const users = await prisma.user.findMany({
            orderBy: { username: "asc" },
        });
        res.status(200).json(users);
    } catch (error) {
        const err = error as Error & { code?: string };
        const descriptionError = {
            message: "Error listando los usuarios.",
            code: err.code || "SERVER_ERROR",
            stackTrace: err.stack || "NO_STACK_TRACE_AVAILABLE",
        };
        res.status(500).json(descriptionError);
    }
};
