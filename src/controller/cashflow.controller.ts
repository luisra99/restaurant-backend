import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import { calcDivisaConversionRateAmount } from "../utils/calc";

const prisma = new PrismaClient();
export const createCashFlow = async (req: Request, res: Response) => {
    try {
        let { amount, movementTypeId, movementTypeDenomination, idDivisa, userId, supervisorUserId, description, movementId } = req.body;

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
        amount = await calcDivisaConversionRateAmount(idDivisa, amount)


        const cashFlow = await prisma.cashFlow.create({
            data: {
                amount: Number(amount),
                movementTypeId,
                movementId,
                idDivisa,
                userId: req.body.user.id,
                supervisorUserId: req.body.user.id, //Cambiar al supervisor
                description,
            },
        });
        if (movementId) {
            let savePayment = await prisma.inventoryMovement.findFirst({ where: { id: movementId } })
            if (savePayment)
                await prisma.inventoryMovement.update({ data: { paidPrice: Number(savePayment.paidPrice) + Number(amount) }, where: { id: movementId } })
        }

        res.status(201).json(cashFlow);
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: 'Error creating cash flow' });
    }
}

export const getCashFlows = async (req: Request, res: Response) => {
    try {
        const cashFlows = await prisma.cashFlow.findMany({
            include: {
                movementType: true, divisa: true, user: true, supervisorUser: true, InventoryMovement: {
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
                        },
                        user: true,
                        supervisorUser: true,
                    }
                }
            },
            orderBy: { date: "desc" }
        });
        res.status(200).json(cashFlows);
    } catch (error) {
        res.status(500).json({ error: 'Error retrieving cash flows' });
    }
}

export const getBalance = async (req: Request, res: Response) => {
    try {
        const ingresos = await prisma.cashFlow.findMany({ where: { movementType: { conceptFather: { denomination: { equals: "Concepto de ingreso" } } } } });
        const retiros = await prisma.cashFlow.findMany({ where: { movementType: { conceptFather: { denomination: { equals: "Concepto de retiro" } } } } });
        const mermas = await prisma.cashFlow.findMany({ where: { movementType: { denomination: "Merma" } } });
        const venta = await prisma.cashFlow.findMany({ where: { movementType: { denomination: "Venta Directa" } } });
        const cashflow = await prisma.cashFlow.findMany({ include: { movementType: true } });
        console.log(cashflow.reduce((acc, movement) => {
            const { denomination } = movement.movementType;
            acc[denomination] = (acc[denomination] || 0) + Number(movement.amount);
            return acc;
        }, {} as Record<string, number>))
        const ventaDirecta = venta.reduce((acc, venta) => acc + Number(venta.amount), 0);
        const perdidasPorMerma = mermas.reduce((acc, perdida) => acc + Number(perdida.amount), 0);
        const totalIngresos = ingresos.reduce((acc, ingreso) => acc + Number(ingreso.amount), 0);
        const totalRetiros = retiros.reduce((acc, retiro) => acc + Number(retiro.amount), 0);
        const balance = totalIngresos - totalRetiros;

        res.status(200).json({ balance, perdidasPorMerma, totalIngresos, totalRetiros, ventaDirecta });
    } catch (error) {
        res.status(500).json({ error: 'Error retrieving cash flows' });
    }
}

export const updateCashFlow = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const cashFlow = await prisma.cashFlow.update({
            where: { id },
            data: req.body,
        });
        res.status(200).json(cashFlow);
    } catch (error) {
        res.status(500).json({ error: 'Error updating cash flow' });
    }
}

export const deleteCashFlow = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        await prisma.cashFlow.delete({
            where: { id },
        });
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: 'Error deleting cash flow' });
    }
}

export const saveCashFlow = async ({ movementType, movementTypeId, amount, idDivisa, description, movementId, quantity }: any) => {
    if (amount) {
        if (idDivisa) {
            amount = await calcDivisaConversionRateAmount(idDivisa, amount);
        }
        if (movementType == "Merma") {
            amount = quantity * amount
        }
        switch (movementType) {
            case "Merma":
                movementTypeId = (await prisma.concept.findFirst({ where: { denomination: "Merma" } }))?.id

                break;
            case "Entrada":
                movementTypeId = (await prisma.concept.findFirst({ where: { denomination: "Pago" } }))?.id

                break;
            case "Venta Directa":
                movementTypeId = (await prisma.concept.findFirst({ where: { denomination: "Cobro" } }))?.id
                break;
            default:
                return
        }

        const cashflow = await prisma.cashFlow.create({ data: { amount, idDivisa, description, movementTypeId, movementId } })
    }
}