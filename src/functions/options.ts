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
export const typeUnitOfMeasure = async () => {
  try {
    // Obtener el concepto "Tipos de unidad de medida"
    const tipoUnidadMedida = await prisma.unitOfMeasure.findMany({
    });

    if (!tipoUnidadMedida) {
      throw new Error("Concepto 'Tipos de movimiento' no encontrado.");
    }

    const types = tipoUnidadMedida.map((unidad: any) => unidad.type)
    const collection = [...new Set(types)]
    return collection;
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

export const unitOfMeasure = async (type: string) => {
  try {
    // Obtener el concepto "Tipos de unidad de medida"
    const tipoUnidadMedida = await prisma.unitOfMeasure.findMany({
      where: { type },
    });

    if (!tipoUnidadMedida) {
      throw new Error("Concepto 'Tipos de movimiento' no encontrado.");
    }


    return tipoUnidadMedida;
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
export const movementType = async () => {
  try {
    // Obtener el concepto "Tipos de movimiento"
    const tipoMovimiento = await prisma.concept.findFirst({
      where: { denomination: "Tipos de movimiento" },
    });

    if (!tipoMovimiento) {
      throw new Error("Concepto 'Tipos de movimiento' no encontrado.");
    }

    // Obtener los conceptos que tienen como padre el concepto "Tipos de movimiento"
    const movimientos = await prisma.concept.findMany({
      where: { fatherId: tipoMovimiento.id }, select: { denomination: true, id: true }
    });

    return movimientos;
  } catch (error) {
    console.log(error);
    const err = error as Error & { code?: string };
    const descriptionError = {
      message: "Error listando los tipos de movimientos.",
      code: err.code || "SERVER_ERROR",
      stackTrace: err.stack || "NO_STACK_TRACE_AVAILABLE",
    };
    throw new Error("Error listando las mesas.");
  }
};