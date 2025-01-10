import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";

const prisma = new PrismaClient();

// Listar todas las unidades de medida
export const listUnitOfMeasures = async (req: Request, res: Response): Promise<void> => {
    try {
        const unitOfMeasures = await prisma.unitOfMeasure.findMany();
        res.status(200).json(unitOfMeasures);
    } catch (error) {
        await prisma.errorLogs.create({
            data: { info: "listUnitOfMeasures", error: JSON.stringify(error) },
        });
        res.status(500).json({ error: (error as Error).message });
    }
};

// Obtener una unidad de medida por ID
export const getUnitOfMeasureById = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;

        const unitOfMeasure = await prisma.unitOfMeasure.findUnique({
            where: { id },
        });

        if (!unitOfMeasure) {
            res.status(404).json({ message: "Unidad de medida no encontrada." });
            return;
        }

        res.status(200).json(unitOfMeasure);
    } catch (error) {
        await prisma.errorLogs.create({
            data: { info: "getUnitOfMeasureById", error: JSON.stringify(error) },
        });
        res.status(500).json({ error: (error as Error).message });
    }
};

// Crear una nueva unidad de medida
export const createUnitOfMeasure = async (req: Request, res: Response): Promise<void> => {
    try {
        const { name, abbreviation } = req.body;

        if (!name || !abbreviation) {
            res.status(400).json({ message: "El nombre y la abreviatura son obligatorios." });
            return;
        }

        const newUnitOfMeasure = await prisma.unitOfMeasure.create({
            data: {
                name,
                abbreviation,
            },
        });

        res.status(201).json(newUnitOfMeasure);
    } catch (error) {
        await prisma.errorLogs.create({
            data: { info: "createUnitOfMeasure", error: JSON.stringify(error) },
        });
        res.status(500).json({ error: (error as Error).message });
    }
};

// Actualizar una unidad de medida
export const updateUnitOfMeasure = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const { name, abbreviation } = req.body;

        if (!name || !abbreviation) {
            res.status(400).json({ message: "El nombre y la abreviatura son obligatorios." });
            return;
        }

        const updatedUnitOfMeasure = await prisma.unitOfMeasure.update({
            where: { id },
            data: {
                name,
                abbreviation,
            },
        });

        res.status(200).json(updatedUnitOfMeasure);
    } catch (error) {
        await prisma.errorLogs.create({
            data: { info: "updateUnitOfMeasure", error: JSON.stringify(error) },
        });
        res.status(500).json({ error: (error as Error).message });
    }
};

// Eliminar una unidad de medida
export const deleteUnitOfMeasure = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;

        await prisma.unitOfMeasure.delete({
            where: { id },
        });

        res.status(200).json({ message: "Unidad de medida eliminada correctamente." });
    } catch (error) {
        await prisma.errorLogs.create({
            data: { info: "deleteUnitOfMeasure", error: JSON.stringify(error) },
        });
        res.status(500).json({ error: (error as Error).message });
    }
};