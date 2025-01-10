import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";

const prisma = new PrismaClient();

// Listar todos los locales
export const listLocals = async (req: Request, res: Response): Promise<void> => {
    try {
        const locals = await prisma.local.findMany();
        res.status(200).json(locals);
    } catch (error) {
        await prisma.errorLogs.create({
            data: { info: "listLocals", error: JSON.stringify(error) },
        });
        res.status(500).json({ error: (error as Error).message });
    }
};

// Obtener un local por ID
export const getLocalById = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;

        const local = await prisma.local.findUnique({
            where: { id },
        });

        if (!local) {
            res.status(404).json({ message: "Local no encontrado." });
            return;
        }

        res.status(200).json(local);
    } catch (error) {
        await prisma.errorLogs.create({
            data: { info: "getLocalById", error: JSON.stringify(error) },
        });
        res.status(500).json({ error: (error as Error).message });
    }
};
export const getLocalAreasById = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;

        const areas = await prisma.area.findMany({
            where: { localId: { equals: id } },
        });

        res.status(200).json(areas);
    } catch (error) {
        await prisma.errorLogs.create({
            data: { info: "getLocalById", error: JSON.stringify(error) },
        });
        res.status(500).json({ error: (error as Error).message });
    }
};

// Crear un nuevo local
export const createLocal = async (req: Request, res: Response): Promise<void> => {
    try {
        const { name, address } = req.body;

        if (!name || !address) {
            res.status(400).json({ message: "El nombre y la dirección son obligatorios." });
            return;
        }

        const newLocal = await prisma.local.create({
            data: {
                name,
                address,
            },
        });

        res.status(201).json(newLocal);
    } catch (error) {
        await prisma.errorLogs.create({
            data: { info: "createLocal", error: JSON.stringify(error) },
        });
        res.status(500).json({ error: (error as Error).message });
    }
};

// Actualizar un local
export const updateLocal = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const { name, address } = req.body;

        if (!name || !address) {
            res.status(400).json({ message: "El nombre y la dirección son obligatorios." });
            return;
        }

        const updatedLocal = await prisma.local.update({
            where: { id },
            data: {
                name,
                address,
            },
        });

        res.status(200).json(updatedLocal);
    } catch (error) {
        await prisma.errorLogs.create({
            data: { info: "updateLocal", error: JSON.stringify(error) },
        });
        res.status(500).json({ error: (error as Error).message });
    }
};

// Eliminar un local
export const deleteLocal = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;

        await prisma.local.delete({
            where: { id },
        });

        res.status(200).json({ message: "Local eliminado correctamente." });
    } catch (error) {
        await prisma.errorLogs.create({
            data: { info: "deleteLocal", error: JSON.stringify(error) },
        });
        res.status(500).json({ error: (error as Error).message });
    }
};