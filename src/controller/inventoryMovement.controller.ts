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


        const standar = { "units": "u", "mass": "g", "volume": "mL", "distance": "cm" }
        const product = await prisma.inventoryItem.findUnique({ where: { id: itemId } })
        const unitOfMeasureStandar = await prisma.unitOfMeasure.findFirst({ where: { abbreviation: standar[product?.unitOfMeasureId as never] as never } })
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


        const newInventoryMovement: any = req.body.user.id ? await prisma.inventoryMovement.create({
            data: {
                movementTypeId,
                itemId,
                stockInputMovementId: inputMovementId,
                quantity: Number(quantity),
                unitOfMesure,
                unitPrice: movementTypeDenomination == "Venta Directa" ? Number(unitPriceSell ?? 0) : Number(unitPrice ?? 0),
                paidPrice: Number(paidPrice ?? 0),
                supplierCustomerId,
                fromAreaId,
                toAreaId,
                userId: req.body.user.id,
                details,
                supervisorUserId,
                approved,
            },
        }) : console.log("");

        const existingItemInStockDestiny = await prisma.stock.findFirst({
            where: { itemId, areaId: toAreaId, },
        })


        const existingItemInStockSource = fromAreaId
            ? await prisma.stock.findFirst({
                where: { itemId, areaId: fromAreaId },
            })
            : null;

        // Si hay un área de origen
        if (fromAreaId) {
            // Verificar si hay suficiente stock en el área de origen antes de realizar el movimiento
            if (!existingItemInStockSource || existingItemInStockSource.quantity < quantity) {
                throw new Error(
                    `No hay suficiente stock en el área de origen (${fromAreaId}).`
                );
            }
            // Si ya existe el artículo en el área de destino, sumar la cantidad
            if (toAreaId && movementTypeDenomination != "Salida") {
                if (existingItemInStockDestiny) {
                    await prisma.stock.update({
                        where: {
                            itemId_areaId: { itemId, areaId: toAreaId }
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
                        },
                    });
                }
            }


            // Reducir la cantidad en el área de origen
            await prisma.stock.update({
                where: {
                    itemId_areaId: { itemId, areaId: fromAreaId }
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

                    },
                });
            } else {
                await prisma.stock.update({
                    where: {
                        itemId_areaId: { itemId, areaId: toAreaId }
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
// export const updateInventoryMovement = async (req: Request, res: Response): Promise<void> => {
//     try {
//         const { id } = req.params;
//         const {
//             movementTypeId,
//             itemId,
//             quantity,
//             unitOfMesure,
//             unitPrice,
//             paidPrice,
//             supplierCustomerId,
//             fromAreaId,
//             toAreaId,
//             userId,
//             details,
//             supervisorUserId,
//             approved,
//         } = req.body;
//         const getMovementForQuantity = await prisma.inventoryMovement.findUnique({ where: { id } })



//         const existingItemInStockDestiny = await prisma.stock.findFirst({
//             where: { itemId, areaId: toAreaId, },
//         })


//         const existingItemInStockSource = fromAreaId
//             ? await prisma.stock.findFirst({
//                 where: { itemId, areaId: fromAreaId },
//             })
//             : null;

//         const compareQuantity = Number(getMovementForQuantity?.quantity) == Number(quantity)

//         if (compareQuantity) {

//         }


//         const updatedInventoryMovement = await prisma.inventoryMovement.update({
//             where: { id },
//             data: {
//                 movementTypeId,
//                 itemId,
//                 quantity:Number(quantity),
//                 unitOfMesure,
//                 unitPrice: Number(unitPrice),
//                 paidPrice: Number(paidPrice),
//                 supplierCustomerId,
//                 fromAreaId,
//                 toAreaId,
//                 userId,
//                 details,
//                 supervisorUserId,
//                 approved
//             },
//         });




//         const updateStockNew = await prisma.stock.update({ where: {itemId_areaId:{areaId,itemId}},data:{}})
//         const updateStock = await prisma.stock.update({ data: { expireDate: convertExpireDate(req.body.expireDate), unitPrice: Number(unitPrice) }, where: { inputMovementId: id } })
//         res.status(200).json(updatedInventoryMovement);
//     } catch (error) {
//         await prisma.errorLogs.create({
//             data: { info: "updateInventoryMovement", error: JSON.stringify(error) },
//         });
//         console.log(error)
//         res.status(500).json({ error: (error as Error).message });
//     }
// };

// Eliminar un movimiento de inventario
export const undoInventoryMovement = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;

        const movimiento = await prisma.inventoryMovement.findFirst({
            where: { id },
        });
        if (!movimiento) res.status(404).json({ message: "Movimiento de inventario no encontrado." });

        const existingItemInStockDestiny = await prisma.stock.findFirst({
            where: { itemId: movimiento?.itemId, areaId: movimiento?.toAreaId ?? undefined, },
        })
        const existingItemInStockSource =
            await prisma.stock.findFirst({
                where: { itemId: movimiento?.itemId, areaId: movimiento?.fromAreaId ?? undefined },
            })
            ;
        if (existingItemInStockDestiny && movimiento && movimiento?.toAreaId) {
            await prisma.stock.update({ where: { itemId_areaId: { itemId: movimiento?.itemId, areaId: movimiento?.toAreaId } }, data: { quantity: Number(existingItemInStockDestiny.quantity) - Number(movimiento.quantity) } })
        }
        if (existingItemInStockSource && movimiento && movimiento?.fromAreaId) {
            await prisma.stock.update({ where: { itemId_areaId: { itemId: movimiento?.itemId, areaId: movimiento?.fromAreaId } }, data: { quantity: Number(existingItemInStockSource.quantity) + Number(movimiento.quantity) } })
        }

        await prisma.inventoryMovement.delete({ where: { id } });
        await prisma.cashFlow.deleteMany({ where: { movementId: id } });

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
        const { itemId, areaId } = req.query
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
                supervisorUser: true, supplierCustomer: true
            },
            orderBy: {
                movementDate: "desc"
            },
            where: {
                itemId: itemId?.toString().length ? itemId?.toString() : undefined,
                AND: {
                    OR: [{ fromAreaId: areaId?.length ? areaId?.toString() : undefined },
                    { toAreaId: areaId?.length ? areaId?.toString() : undefined }]
                }


            }
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
            supplierCustomer: movement.supplierCustomer?.name,
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
        const { itemId, areaId } = req.query

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
            orderBy: { movementDate: "desc" }, where: { movementType: { denomination: "Salida" }, AND: { itemId: itemId?.length ? itemId?.toString() : undefined, OR: [{ fromAreaId: areaId?.length ? areaId?.toString() : undefined }, { toAreaId: areaId?.length ? areaId?.toString() : undefined }] } }


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