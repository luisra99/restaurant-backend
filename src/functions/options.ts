import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const tables = async () => {
  try {
    const tables = await prisma.table.findMany({
      include: {
        Account: {
          include: {
            details: {
              include: {
                offer: true,
              },
            },
            dependent: true,
            _count: true,
          },
          where: { closed: { equals: null } },
        },
      },
      orderBy: { details: "asc" },
    });
    const response = tables.map((table) => {
      let amount = 0;

      // Si la mesa tiene una cuenta asociada
      if (table.Account[0]) {
        // Iterar sobre los detalles de la cuenta para calcular el total
        amount = table.Account?.[0].details.reduce((total, detail) => {
          return total + detail.offer.price.toNumber() * detail.quantity;
        }, 0);
      }

      // Retornar la mesa con el total calculado

      return {
        ...table,
        Account: table.Account[0],
        amount, // Total calculado para esta mesa
      };
    });
    return response;
  } catch (error) {
    console.log(error);
    const err = error as Error & { code?: string };
    const descriptionError = {
      message: "Error listando las mesas.",
      code: err.code || "SERVER_ERROR",
      stackTrace: err.stack || "NO_STACK_TRACE_AVAILABLE",
    };
    throw new Error("Error listando las mesas.");
  }
};
