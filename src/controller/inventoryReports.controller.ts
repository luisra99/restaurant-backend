import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";

const prisma = new PrismaClient();
const calculateProductQuantities = (data: any): any[] => {
    const localProductQuantitiesMap: { [localId: string]: any } = {};

    const processMovements = (local: any, isInput: boolean) => {
        local.areas.forEach((area: any) => {
            const movements = isInput ? area.InventoryMovementTo : area.InventoryMovementFrom;
            movements?.forEach((movement: any) => {
                const localId = local.id;
                const areaId = area.id;
                const areaName = area.name;
                const itemId = movement.itemId;
                const itemName = movement.item.name;
                const quantity = isInput ? movement.quantity : -movement.quantity;
                const unitOfMesure = movement.unit.abbreviation;
                if (!localProductQuantitiesMap[localId]) {
                    localProductQuantitiesMap[localId] = {
                        localId,
                        localName: local.name,
                        areas: [],
                    };
                }

                const localProductQuantities = localProductQuantitiesMap[localId];
                let areaProductQuantities = localProductQuantities.areas.find((a: any) => a.areaId === areaId);

                if (!areaProductQuantities) {
                    areaProductQuantities = {
                        areaId,
                        areaName,
                        products: [],
                    };
                    localProductQuantities.areas.push(areaProductQuantities);
                }

                let productQuantity = areaProductQuantities.products.find((p: any) => p.itemId === itemId);

                if (!productQuantity) {
                    productQuantity = {
                        itemId,
                        itemName,
                        quantity: 0,
                        unitOfMesure,
                        price: []
                    };
                    areaProductQuantities.products.push(productQuantity);
                }

                if (typeof movement.unitPrice == "number") productQuantity.price = [...new Set([...productQuantity.price, movement.unitPrice])]
                productQuantity.quantity += quantity;
            });
        });
    };

    data.inputs.forEach((local: any) => processMovements(local, true));
    data.outputs.forEach((local: any) => processMovements(local, false));

    return Object.values(localProductQuantitiesMap);
};

export const getStockByLocal = async (req: Request, res: Response): Promise<void> => {
    try {
        const inputs = await prisma.local.findMany({ include: { areas: { include: { InventoryMovementTo: { include: { item: true, unit: true }, } } } } })
        const stock = await prisma.local.findMany({ include: { areas: { include: { stock: { where: { quantity: { gt: 0 } }, include: { InventoryMovement: true, Item: true }, } } } } })
        const outputs = await prisma.local.findMany({ include: { areas: { include: { InventoryMovementFrom: { include: { item: true, unit: true } } } } } })
        const standar: any = { "mass": "kg", "volume": "lt", "distance": "m", "units": "u" }

        console.log(stock)
        const stockByAreaInLocal = stock.map((local: any) => {
            return {
                localId: local.id,
                localName: local.name,
                areas: local.areas.map((area: any) => {
                    let products: any = {}
                    area.stock.forEach((stockItem: any) => {
                        products[stockItem.itemId] = {
                            itemId: stockItem.itemId,
                            itemName: stockItem.Item.name,
                            quantity: (products[stockItem?.itemId]?.quantity ?? 0) + stockItem.quantity,
                            unitOfMesure: standar[stockItem.Item.unitOfMeasureId],
                        }
                    })
                    return {
                        areaId: area.id,
                        areaName: area.name,
                        products
                    };
                })
            };
        });

        res.json(stockByAreaInLocal)
        // res.json(calculateProductQuantities({ inputs, outputs }))
    } catch (error) {
        await prisma.errorLogs.create({
            data: { info: "getStockByLocal", error: JSON.stringify(error) },
        });
        res.status(500).json({ error: (error as Error).message });
    }
};

//     try {
//         const stockByArea = await prisma.area.findMany({
//             select: {
//                 name: true,
//                 inventoryMovements: {
//                     select: {
//                         item: {
//                             select: {
//                                 name: true,
//                             },
//                         },
//                         quantity: true,
//                         movementType: {
//                             select: {
//                                 denomination: true,
//                             },
//                         },
//                     },
//                 },
//             },
//         });

//         const result = stockByArea.map(area => {
//             const stock = area.inventoryMovements.reduce((acc, movement) => {
//                 const itemName = movement.item.name;
//                 const quantity = movement.movementType.denomination === 'Entrada' || movement.movementType.denomination === 'Traslado'
//                     ? movement.quantity
//                     : -movement.quantity;

//                 if (!acc[itemName]) {
//                     acc[itemName] = 0;
//                 }
//                 acc[itemName] += quantity;
//                 return acc;
//             }, {} as Record<string, number>);

//             return Object.entries(stock).map(([itemName, quantity]) => ({
//                 areaName: area.name,
//                 itemName,
//                 stock: quantity,
//             }));
//         }).flat().filter(item => item.stock > 0);

//         res.status(200).json(result);
//     } catch (error) {
//         await prisma.errorLogs.create({
//             data: { info: "getStockByArea", error: JSON.stringify(error) },
//         });
//         res.status(500).json({ error: (error as Error).message });
//     }
// };