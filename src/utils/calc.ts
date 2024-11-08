import { Concept } from "@prisma/client";

export const getDivisaConversionRateAmount = (
  amount: number,
  divisa: Concept
) => {
  if (divisa && divisa.details) {
    const conversionRate = Number(divisa.details);
    if (!isNaN(conversionRate)) {
      // Multiplicar amount por el tipo de cambio
      amount *= conversionRate;
    }
    return amount;
  } else {
    throw new Error("Divisa no válida o sin tasa de conversión.");
  }
};
