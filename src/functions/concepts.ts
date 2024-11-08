import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const getChangeConcept = async () => {
  try {
    const concept = await prisma.concept.findFirst({
      where: { denomination: "Cambio" },
    });
    if (concept) return concept;
    else throw new Error("El concepto de cambio no está configurado");
  } catch (error: any) {
    console.log(error);
    throw new Error("Error obteniendo la configuración para el cambio");
  }
};
export const getPropinaConcept = async () => {
  try {
    const concept = await prisma.concept.findFirst({
      where: { denomination: { equals: "Propina" } },
    });
    if (concept) return concept;
    else throw new Error("El concepto de propina no está configurado");
  } catch (error: any) {
    console.log(error);
    throw new Error("Error obteniendo la configuración para la propina");
  }
};
export const getAccountDefaultConcept = async () => {
  try {
    const concept = await prisma.concept.findFirst({
      where: { denomination: "Cuenta Normal" },
    });
    if (concept) return concept;
    else throw new Error("No se encontró el tipo de cuenta por defecto");
  } catch (error: any) {
    console.log(error);
    throw new Error("Error obteniendo el tipo de cuenta por defecto");
  }
};
export const getDivisaConcept = async (idDivisa: string) => {
  try {
    const concept = await prisma.concept.findUnique({
      where: {
        id: idDivisa, // Convertimos a número para buscar el id
      },
    });
    if (concept) return concept;
    else throw new Error("No se encontró el registro de la divisa");
  } catch (error: any) {
    console.log(error);
    throw new Error("Error obteniendo el registro de la divisa");
  }
};
export const getConceptByDenomination = async (denomination: string) => {
  try {
    const fatherConcept = await prisma.concept.findFirst({
      where: {
        denomination,
      },
    });

    if (!fatherConcept) {
      throw new Error("No se encontró el concepto padre");
    }
    return fatherConcept;
  } catch (error) {
    console.log(error);
    throw new Error("Error encontrando al concepto padre");
  }
};
export const getConceptsByFatherId = async (fatherId: string) => {
  try {
    const concepts = await prisma.concept.findMany({
      where: {
        fatherId,
      },
      orderBy: { denomination: "asc" },
    });

    return concepts;
  } catch (error) {
    console.log(error);
    throw new Error("Error encontrando los conceptos asociados");
  }
};
export const createNewConcept = async (
  fatherId: string,
  denomination: string,
  details?: string
) => {
  try {
    const concept = await prisma.concept.create({
      data: {
        denomination,
        details,
        fatherId,
      },
    });

    return concept;
  } catch (error) {
    console.log(error);
    throw new Error("Error creando el concepto");
  }
};
