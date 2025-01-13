import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import { number } from "zod";

const prisma = new PrismaClient();

// Listar todos los movimientos de inventario
export const listInventoryMovementsOLD = async (req: Request, res: Response): Promise<void> => {
    try {
        const inventoryMovements = await prisma.inventoryMovement.findMany({
            include: {
                fromArea: true,
                toArea: true,
                item: true,
                movementType: true,
                supplierCustomer: true,
                user: true,
            },
        });
        res.status(200).json(inventoryMovements);
    } catch (error) {
        await prisma.errorLogs.create({
            data: { info: "listInventoryMovements", error: JSON.stringify(error) },
        });
        res.status(500).json({ error: (error as Error).message });
    }
};

// Obtener un movimiento de inventario por ID
export const getInventoryMovementById = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;

        const inventoryMovement = await prisma.inventoryMovement.findUnique({
            where: { id },
            include: {
                fromArea: true,
                toArea: true,
                item: true,
                movementType: true,
                supplierCustomer: true,
                user: true,
            },
        });

        if (!inventoryMovement) {
            res.status(404).json({ message: "Movimiento de inventario no encontrado." });
            return;
        }

        res.status(200).json(inventoryMovement);
    } catch (error) {
        await prisma.errorLogs.create({
            data: { info: "getInventoryMovementById", error: JSON.stringify(error) },
        });
        res.status(500).json({ error: (error as Error).message });
    }
};

// Crear un nuevo movimiento de inventario
export const createInventoryMovement = async (req: Request, res: Response): Promise<void> => {
    try {
        const {
            movementTypeId,
            itemId,
            quantity,
            unitOfMesure,
            unitPrice,
            paidPrice,
            supplierCustomerId,
            fromAreaId,
            toAreaId,
            details,
            supervisorUserId,
            approved,
        } = req.body;

        const newInventoryMovement = await prisma.inventoryMovement.create({
            data: {
                movementTypeId,
                itemId,
                quantity: Number(quantity),
                unitOfMesure,
                unitPrice: Number(unitPrice),
                paidPrice: Number(paidPrice),
                supplierCustomerId,
                fromAreaId,
                toAreaId,
                userId: req.body.user.id,
                details,
                supervisorUserId,
                approved,
            },
        });

        res.status(201).json(newInventoryMovement);
    } catch (error) {
        await prisma.errorLogs.create({
            data: { info: "createInventoryMovement", error: JSON.stringify(error) },
        });
        console.log(error);
        res.status(500).json({ error: (error as Error).message });
    }
};

// Actualizar un movimiento de inventario
export const updateInventoryMovement = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const {
            movementTypeId,
            itemId,
            quantity,
            unitOfMesure,
            unitPrice,
            paidPrice,
            supplierCustomerId,
            fromAreaId,
            toAreaId,
            userId,
            details,
            supervisorUserId,
            approved,
        } = req.body;

        const updatedInventoryMovement = await prisma.inventoryMovement.update({
            where: { id },
            data: {
                movementTypeId,
                itemId,
                quantity,
                unitOfMesure,
                unitPrice,
                paidPrice,
                supplierCustomerId,
                fromAreaId,
                toAreaId,
                userId,
                details,
                supervisorUserId,
                approved,
            },
        });

        res.status(200).json(updatedInventoryMovement);
    } catch (error) {
        await prisma.errorLogs.create({
            data: { info: "updateInventoryMovement", error: JSON.stringify(error) },
        });
        res.status(500).json({ error: (error as Error).message });
    }
};

// Eliminar un movimiento de inventario
export const deleteInventoryMovement = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;

        await prisma.inventoryMovement.delete({
            where: { id },
        });

        res.status(200).json({ message: "Movimiento de inventario eliminado correctamente." });
    } catch (error) {
        await prisma.errorLogs.create({
            data: { info: "deleteInventoryMovement", error: JSON.stringify(error) },
        });
        res.status(500).json({ error: (error as Error).message });
    }
};

export const listInventoryMovements = async (req: Request, res: Response): Promise<void> => {
    try {
        const inventoryMovements = await prisma.inventoryMovement.findMany({
            include: {
                movementType: true,
                item: {
                    include: {
                        unitOfMeasure: true,
                    },
                },
                fromArea: {
                    include: {
                        local: true,
                    },
                },
                toArea: {
                    include: {
                        local: true,
                    },
                },
                user: true,
                supervisorUser: true,
            },
        });

        const detailedMovements = inventoryMovements.map((movement) => ({
            ...movement,
            movementTypeDenomination: movement.movementType.denomination,
            itemName: movement.item.name,
            quantity: movement.quantity,
            unitOfMeasure: movement.unitOfMesure,
            unitPrice: movement.unitPrice,
            totalPrice: movement.unitPrice * movement.quantity,
            paidPrice: movement.paidPrice,
            originLocal: movement.fromArea?.local.name,
            originArea: movement.fromArea?.name,
            destinationLocal: movement.toArea?.local.name,
            destinationArea: movement.toArea?.name,
            movementUser: movement.user ? movement.user.username : null,
            details: movement.details,
            approved: movement.approved,
            supervisor: movement.supervisorUser ? movement.supervisorUser.username : null,
        }));

        res.status(200).json(detailedMovements);
    } catch (error) {
        await prisma.errorLogs.create({
            data: { info: "listDetailedInventoryMovements", error: JSON.stringify(error) },
        });
        res.status(500).json({ error: (error as Error).message });
    }
};