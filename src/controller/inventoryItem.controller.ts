import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";

const prisma = new PrismaClient();

// Listar todos los artículos de inventario
export const listInventoryItems = async (req: Request, res: Response): Promise<void> => {
    try {
        const inventoryItems = await prisma.inventoryItem.findMany({ include: { InventoryMovement: { where: { movementType: { denomination: { equals: "Entrada" } } } } }, orderBy: { name: "asc" } });

        res.status(200).json(inventoryItems.map((item: any) => {
            item.InventoryMovement = item.InventoryMovement?.map((movement: any) => movement.unitPrice).sort()
            item.name = `${item.name}`
            item.priceTag = `${item.InventoryMovement?.length > 0 ? ` ($${item.InventoryMovement?.length == 1 ? `${item.InventoryMovement[0]})` : `${item.InventoryMovement[0]}${item.InventoryMovement[item.InventoryMovement.length - 1] == item.InventoryMovement[0] ? "" : ` - $${item.InventoryMovement[item.InventoryMovement.length - 1]}`})`}` : ""}`
            return item
        }));
    } catch (error) {
        await prisma.errorLogs.create({
            data: { info: "listInventoryItems", error: JSON.stringify(error) },
        });
        res.status(500).json({ error: (error as Error).message });
    }
};

// Obtener un artículo de inventario por ID
export const getInventoryItemById = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;

        const inventoryItem = await prisma.inventoryItem.findUnique({
            where: { id },
        });

        if (!inventoryItem) {
            res.status(404).json({ message: "Artículo de inventario no encontrado." });
            return;
        }

        res.status(200).json(inventoryItem);
    } catch (error) {
        await prisma.errorLogs.create({
            data: { info: "getInventoryItemById", error: JSON.stringify(error) },
        });
        res.status(500).json({ error: (error as Error).message });
    }
};

// Crear un nuevo artículo de inventario
export const createInventoryItem = async (req: Request, res: Response): Promise<void> => {
    try {
        const { name, description, unitOfMeasureId } = req.body;

        if (!name || !unitOfMeasureId) {
            res.status(400).json({ message: "El nombre y la unidad de medida son obligatorios." });
            return;
        }

        const newInventoryItem = await prisma.inventoryItem.create({
            data: {
                name,
                description,
                unitOfMeasureId,
            },
        });

        res.status(201).json(newInventoryItem);
    } catch (error: any) {
        await prisma.errorLogs.create({
            data: { info: "createInventoryItem", error: JSON.stringify(error) },
        });
        res.status(500).json({ error: error.code === "P2002" ? "No pueden haber productos con el mismo nombre" : "" });
    }
};

// Actualizar un artículo de inventario
export const updateInventoryItem = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const { name, description, unitOfMeasureId } = req.body;

        if (!name || !unitOfMeasureId) {
            res.status(400).json({ message: "El nombre y la unidad de medida son obligatorios." });
            return;
        }

        const updatedInventoryItem = await prisma.inventoryItem.update({
            where: { id },
            data: {
                name,
                description,
                unitOfMeasureId,
            },
        });

        res.status(200).json(updatedInventoryItem);
    } catch (error) {
        await prisma.errorLogs.create({
            data: { info: "updateInventoryItem", error: JSON.stringify(error) },
        });
        res.status(500).json({ error: (error as Error).message });
    }
};

// Eliminar un artículo de inventario
export const deleteInventoryItem = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;

        await prisma.inventoryItem.delete({
            where: { id },
        });

        res.status(200).json({ message: "Artículo de inventario eliminado correctamente." });
    } catch (error) {
        await prisma.errorLogs.create({
            data: { info: "deleteInventoryItem", error: JSON.stringify(error) },
        });
        res.status(500).json({ error: (error as Error).message });
    }
};
export const getStockItem = async (req: Request, res: Response): Promise<void> => {
    try {
        const { itemId, areaId }: any = req.query;
        const standar: any = { "mass": "kg", "volume": "lt", "distance": "m", "units": "u" }

        const items = await prisma.stock.findMany({
            where: { itemId, areaId, quantity: { gt: 0 }, InventoryMovement: { movementType: { denomination: { not: "Salida" } } } }, include: { Item: true, InventoryMovement: true }, orderBy: { InventoryMovement: { movementDate: "asc" } },
        });

        res.status(200).json(items.map((item) => { return { ...item, unitOfMeasure: standar[item.Item.unitOfMeasureId], } }));
    } catch (error) {
        await prisma.errorLogs.create({
            data: { info: "deleteInventoryItem", error: JSON.stringify(error) },
        });
        res.status(500).json({ error: (error as Error).message });
    }
};