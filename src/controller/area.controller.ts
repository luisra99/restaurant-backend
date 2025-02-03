import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";

const prisma = new PrismaClient();

// Listar todas las áreas
export const listAreas = async (req: Request, res: Response): Promise<void> => {
    try {
        const areas = await prisma.area.findMany({ include: { local: true }, orderBy: { name: "asc" } });
        res.status(200).json(areas.sort((a: any, b: any) => a.local.name.toLowerCase() < b.local.name.toLowerCase() ? -1 : a.local.name.toLowerCase() > b.local.name.toLowerCase() ? 1 : 0));
    } catch (error) {
        await prisma.errorLogs.create({
            data: { info: "listAreas", error: JSON.stringify(error) },
        });
        res.status(500).json({ error: (error as Error).message });
    }
};

// Obtener un área por ID
export const getAreaById = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;

        const area = await prisma.area.findUnique({
            where: { id },
        });

        if (!area) {
            res.status(404).json({ message: "Área no encontrada." });
            return;
        }

        res.status(200).json(area);
    } catch (error) {
        await prisma.errorLogs.create({
            data: { info: "getAreaById", error: JSON.stringify(error) },
        });
        res.status(500).json({ error: (error as Error).message });
    }
};

// Crear una nueva área
export const createArea = async (req: Request, res: Response): Promise<void> => {
    try {
        const { name, localId } = req.body;

        if (!name || !localId) {
            res.status(400).json({ message: "El nombre y el ID del local son obligatorios." });
            return;
        }

        const newArea = await prisma.area.create({
            data: {
                name,
                localId,
            },
        });

        res.status(201).json(newArea);
    } catch (error) {
        await prisma.errorLogs.create({
            data: { info: "createArea", error: JSON.stringify(error) },
        });
        res.status(500).json({ error: (error as Error).message });
    }
};

// Actualizar un área
export const updateArea = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const { name, localId } = req.body;

        if (!name || !localId) {
            res.status(400).json({ message: "El nombre y el ID del local son obligatorios." });
            return;
        }

        const updatedArea = await prisma.area.update({
            where: { id },
            data: {
                name,
                localId,
            },
        });

        res.status(200).json(updatedArea);
    } catch (error) {
        await prisma.errorLogs.create({
            data: { info: "updateArea", error: JSON.stringify(error) },
        });
        res.status(500).json({ error: (error as Error).message });
    }
};

// Eliminar un área
export const deleteArea = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;

        await prisma.area.delete({
            where: { id },
        });

        res.status(200).json({ message: "Área eliminada correctamente." });
    } catch (error) {
        await prisma.errorLogs.create({
            data: { info: "deleteArea", error: JSON.stringify(error) },
        });
        res.status(500).json({ error: (error as Error).message });
    }
};