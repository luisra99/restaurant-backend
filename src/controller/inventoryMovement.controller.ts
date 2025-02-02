import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import { convertExpireDate, revertExpireDate } from "../utils/calc";
import { saveCashFlow } from "./cashflow.controller"
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
            }, orderBy: { movementDate: "desc" }
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
        let {
            movementTypeId,
            movementTypeDenomination,
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
            expireDate,
            inputMovementId,
            abbreviation,
            unitPriceSell
        } = req.body;

        // Convertir expireDate de mes y año a un objeto Date
        if (expireDate) {
            expireDate = convertExpireDate(expireDate);
        }


        const standar = { "Unidades": "u", "Masa": "kg", "Volúmen": "L", "Distancia": "m" }
        console.log({ abbreviation, unitOfMesure })
        const unitOfMeasureData = abbreviation ? await prisma.unitOfMeasure.findFirst({ where: { abbreviation } }) : await prisma.unitOfMeasure.findFirst({ where: { id: unitOfMesure } })
        console.log(unitOfMeasureData)
        const unitOfMeasureStandar = await prisma.unitOfMeasure.findFirst({ where: { abbreviation: standar[unitOfMeasureData?.type as never] as never } })
        console.log(standar[unitOfMeasureData?.type as never])
        quantity *= unitOfMeasureData?.factor?.[standar[unitOfMeasureData.type as never]] ?? 0
        unitPrice *= unitOfMeasureData?.factor?.[standar[unitOfMeasureData.type as never]] ?? 0
        unitOfMesure = unitOfMeasureStandar?.id

        if (movementTypeDenomination) {
            const movementType = await prisma.concept.findFirst({
                where: { denomination: movementTypeDenomination },
            });
            if (movementType) {
                movementTypeId = movementType.id;
            }
        }
        else {
            const movementType = await prisma.concept.findFirst({
                where: { id: movementTypeId },
            });
            if (movementType) {
                movementTypeDenomination = movementType.denomination;
            }
        }


        const newInventoryMovement = await prisma.inventoryMovement.create({
            data: {
                movementTypeId,
                itemId,
                stockInputMovementId: inputMovementId,
                quantity: Number(quantity),
                unitOfMesure,
                unitPrice: movementTypeDenomination == "Venta Directa" ? Number(unitPriceSell) : Number(unitPrice),
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
        const existingItemInStockDestiny = inputMovementId ? await prisma.stock.findFirst({
            where: { itemId, areaId: toAreaId, unitPrice, inputMovementId: inputMovementId },
        }) : null
        console.log("inputMovementId", { itemId, areaId: toAreaId, unitPrice, inputMovementId }, existingItemInStockDestiny)

        const existingItemInStockSource = fromAreaId
            ? await prisma.stock.findFirst({
                where: { itemId, areaId: fromAreaId, unitPrice, inputMovementId },
            })
            : null;

        // Si hay un área de origen
        if (fromAreaId) {
            console.log(existingItemInStockSource, unitOfMeasureData, unitOfMeasureStandar)
            // Verificar si hay suficiente stock en el área de origen antes de realizar el movimiento
            if (!existingItemInStockSource || existingItemInStockSource.quantity < quantity) {
                throw new Error(
                    `No hay suficiente stock en el área de origen (${fromAreaId}).`
                );
            }
            // Si ya existe el artículo en el área de destino, sumar la cantidad
            if (toAreaId) {
                if (existingItemInStockDestiny) {
                    await prisma.stock.update({
                        where: {

                            itemId,
                            areaId: toAreaId,
                            unitPrice,
                            inputMovementId, expireDate
                        },

                        data: {
                            quantity:
                                Number(existingItemInStockDestiny.quantity) +
                                Number(quantity),
                        },
                    });
                } else {
                    // Crear el artículo en el área de destino si no existe
                    await prisma.stock.create({
                        data: {
                            quantity: Number(quantity),
                            itemId,
                            areaId: toAreaId,
                            unitPrice,
                            inputMovementId: newInventoryMovement.id, expireDate
                        },
                    });
                }
            }


            // Reducir la cantidad en el área de origen
            await prisma.stock.update({
                where: {
                    itemId,
                    areaId: fromAreaId,
                    unitPrice,
                    inputMovementId,
                    expireDate
                },
                data: {
                    quantity:
                        Number(existingItemInStockSource.quantity) - Number(quantity),
                },
            });
        } else {
            // Si no hay un área de origen, asume que es una entrada de stock
            if (!existingItemInStockDestiny) {
                console.log(newInventoryMovement)
                await prisma.stock.create({
                    data: {
                        quantity: Number(quantity),
                        itemId,
                        areaId: toAreaId,
                        unitPrice,
                        inputMovementId: newInventoryMovement.id, expireDate
                    },
                });
            } else {
                await prisma.stock.update({
                    where: {
                        itemId,
                        areaId: toAreaId,
                        unitPrice,
                        inputMovementId,
                        expireDate
                    },
                    data: {
                        quantity:
                            Number(existingItemInStockDestiny.quantity) +
                            Number(quantity),
                    },
                });
            }
        }

        saveCashFlow({ movementTypeId, movementType: movementTypeDenomination, amount: movementTypeDenomination == "Venta Directa" ? unitPriceSell : unitPrice, movementId: newInventoryMovement.id, quantity })

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
                unitPrice: Number(unitPrice),
                paidPrice: Number(paidPrice),
                supplierCustomerId,
                fromAreaId,
                toAreaId,
                userId,
                details,
                supervisorUserId,
                approved
            },
        });
        const updateStock = await prisma.stock.update({ data: { expireDate: convertExpireDate(req.body.expireDate), unitPrice: Number(unitPrice) }, where: { inputMovementId: id } })
        res.status(200).json(updatedInventoryMovement);
    } catch (error) {
        await prisma.errorLogs.create({
            data: { info: "updateInventoryMovement", error: JSON.stringify(error) },
        });
        console.log(error)
        res.status(500).json({ error: (error as Error).message });
    }
};

// Eliminar un movimiento de inventario
export const undoInventoryMovement = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;

        const movimiento = await prisma.inventoryMovement.findFirst({
            where: { id },
        });
        if (!movimiento) res.status(404).json({ message: "Movimiento de inventario no encontrado." });

        if (!movimiento?.fromAreaId) {
            await prisma.stock.deleteMany({ where: { inputMovementId: id } })
            await prisma.inventoryMovement.delete({ where: { id } });
            await prisma.cashFlow.deleteMany({ where: { movementId: id } });
        } else {
            const oldStock = movimiento.stockInputMovementId ? await prisma.stock.findFirst({ where: { inputMovementId: movimiento.stockInputMovementId } }) : null;
            const stockToRevert = await prisma.stock.findFirst({ where: { inputMovementId: movimiento.id } });
            if (oldStock && movimiento.stockInputMovementId && stockToRevert) {
                await prisma.stock.update({
                    where: { inputMovementId: movimiento.stockInputMovementId },
                    data: { quantity: oldStock.quantity + stockToRevert.quantity }
                });
                await prisma.stock.delete({ where: { inputMovementId: movimiento.id } });
                await prisma.inventoryMovement.delete({ where: { id } });

            } else {
                res.status(404).json({ message: "Movimiento de inventario original no encontrado." });
            }


        }


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
        const {itemId,areaId}=req.query
        const inventoryMovements = await prisma.inventoryMovement.findMany({
            include: {

                movementType: true,
                item: true,
                unit: true,
                fromArea: {
                    include: {
                        local: true,
                    },
                },
                toArea: {
                    include: {
                        local: true,
                    },
                }, Stock: true
                ,
                user: true,
                supervisorUser: true,
            },
            orderBy: { movementDate: "desc" },where:{itemId:itemId?.toString(),OR:[{fromAreaId:areaId?.length?areaId?.toString():null},{toAreaId:areaId?.length?areaId?.toString():null }]}
        });

        const detailedMovements = inventoryMovements.map((movement: any) => ({
            ...movement,
            movementTypeDenomination: movement.movementType.denomination,
            itemName: movement.item.name,
            quantity: movement.quantity,
            unitOfMeasure: movement.unit.abbreviation,
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
            expireDate: revertExpireDate(movement.Stock?.[0]?.expireDate),
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
export const listInventoryMovementsOut = async (req: Request, res: Response): Promise<void> => {
    try {
        const {itemId,areaId}=req.query

        const inventoryMovements = await prisma.inventoryMovement.findMany({
            include: {
                movementType: true,
                item: true,
                unit: true,
                fromArea: {
                    include: {
                        local: true,
                    },
                },
                toArea: {
                    include: {
                        local: true,
                    },
                }, Stock: true
                ,
                user: true,
                supervisorUser: true,
            },
            orderBy: { movementDate: "desc" },where:{movementType:{denomination:"Salida"}, AND:{itemId:itemId?.length?itemId?.toString():undefined,OR:[{fromAreaId:areaId?.length?areaId?.toString():undefined},{toAreaId:areaId?.length?areaId?.toString():undefined }]}}
       
            
        });

        const detailedMovements = inventoryMovements.map((movement: any) => ({
            ...movement,
            movementTypeDenomination: movement.movementType.denomination,
            itemName: movement.item.name,
            quantity: movement.quantity,
            unitOfMeasure: movement.unit.abbreviation,
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
            expireDate: revertExpireDate(movement.Stock?.[0]?.expireDate),
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
export const listDebs = async (req: Request, res: Response): Promise<void> => {
    try {
        const inventoryMovements = await prisma.inventoryMovement.findMany({
            include: {
                movementType: true,
                item: true,
                fromArea: {
                    include: {
                        local: true,
                    },
                },
                unit: true,
                toArea: {
                    include: {
                        local: true,
                    },
                },
                user: true,
                supervisorUser: true,
            },
            where: {
                movementType: { denomination: { in: ["Entrada", "Venta Directa"] } },
            },
            orderBy: { movementDate: "desc" }
        });
        const filteredMovements = inventoryMovements.filter(movement => movement.paidPrice < (movement.unitPrice * movement.quantity));


        const detailedMovements = filteredMovements.map((movement: any) => ({
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