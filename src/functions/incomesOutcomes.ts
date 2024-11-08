import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const saveMovement = async ({
  amount,
  idConcepto,
}: {
  amount: number;
  idConcepto: string;
}) => {
  try {
    const movement = await prisma.withdraw.create({
      data: { amount: Math.abs(amount), idConcepto },
    });
    return movement;
  } catch (error: any) {
    console.log(error);
    throw new Error("No se pudo registrar el movimiento de caja");
  }
};
