import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const calcDivisaConversionRateAmount = async (
  idDivisa: string,
  amount: number
) => {
  if (idDivisa) {
    const currencyConcept = await prisma.concept.findUnique({
      where: {
        id: idDivisa, // Convertimos a número para buscar el id
      },
    });// Verificar si se encontró el concepto y que details es un número
    if (currencyConcept && currencyConcept.details) {
      const conversionRate = Number(currencyConcept.details);
      if (!isNaN(conversionRate)) {
        // Multiplicar amount por el tipo de cambio
        amount *= conversionRate;
      }
      return amount
    }
  } else {
    return amount
  }
};


export function convertExpireDate(expireDate: string): Date | null {
  if (!expireDate) return null;
  const [year, month] = expireDate.split('-').map(Number);
  return new Date(year, month - 1, 1); // Crear un objeto Date con el primer día del mes
}

// Método para revertir la conversión de expireDate a mes y año
export function revertExpireDate(dateString: string): string | null {
  if (dateString) {
    const date = new Date(dateString)
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear().toString();
    return `${year}-${month}`;
  } else {
    return null
  }
}