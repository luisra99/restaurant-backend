import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { Decimal } from "@prisma/client/runtime/library";
import fs from "fs";
import path from "path";

const prisma = new PrismaClient();

// Función para eliminar imagen antigua si existe
const deleteOldImage = (imagePath: string | null) => {
  if (imagePath && fs.existsSync(imagePath)) {
    fs.unlinkSync(imagePath);
  }
};

// Crear una oferta con imagen
export const createOffer = async (req: Request, res: Response) => {
  try {
    const { name, description, details, idArea, idCategory, price } = req.body;
    const image = req.file?.path; // Obtén la ruta de la imagen subida

    const newOffer = await prisma.offer.create({
      data: {
        name,
        description,
        details,
        idArea: Number(idArea),
        idCategory: Number(idCategory),
        price: new Decimal(price),
        image, // Guarda solo la ruta de la imagen
      },
    });

    res.status(201).json(newOffer);
  } catch (error) {
    if (req.file) {
      deleteOldImage(req.file.path); // Elimina la imagen si ocurre un error
    }

    const err = error as Error & { code?: string };
    const descripcionError = {
      message: "Error creando la oferta.",
      code: err.code || "SERVER_ERROR",
      stackTrace: err.stack || "NO_STACK_TRACE_AVAILABLE",
    };

    res.status(500).json(descripcionError);
  }
};

// Modificar una oferta con imagen
export const updateOffer = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, description, details, idArea, idCategory, price } = req.body;
    const image = req.file?.path; // Obtén la nueva imagen si se sube una

    // Busca la oferta actual para eliminar la imagen anterior si existe
    const offer = await prisma.offer.findUnique({
      where: { id: Number(id) },
    });

    if (!offer) {
      if (req.file) {
        deleteOldImage(req.file.path); // Elimina la nueva imagen si la oferta no existe
      }
      return res.status(404).json({ message: "Oferta no encontrada" });
    }

    // Elimina la imagen anterior si hay una nueva
    if (offer.image && image) {
      deleteOldImage(offer.image);
    }

    const updatedOffer = await prisma.offer.update({
      where: { id: Number(id) },
      data: {
        name,
        description,
        details,
        idArea: Number(idArea),
        idCategory: Number(idCategory),
        price: new Decimal(price),
        image: image || offer.image, // Mantén la imagen existente si no se sube una nueva
      },
    });

    res.status(200).json(updatedOffer);
  } catch (error) {
    if (req.file) {
      deleteOldImage(req.file.path); // Elimina la imagen si ocurre un error
    }

    const err = error as Error & { code?: string };
    const descripcionError = {
      message: "Error modificando la oferta.",
      code: err.code || "SERVER_ERROR",
      stackTrace: err.stack || "NO_STACK_TRACE_AVAILABLE",
    };

    res.status(500).json(descripcionError);
  }
};

// Listar todas las ofertas
export const listOffers = async (req: Request, res: Response) => {
  try {
    const offers = await prisma.offer.findMany({
      include: {
        category: true,
        area: true,
      },
    });

    res.status(200).json(offers);
  } catch (error) {
    const err = error as Error & { code?: string };
    const descripcionError = {
      message: "Error listando las ofertas.",
      code: err.code || "SERVER_ERROR",
      stackTrace: err.stack || "NO_STACK_TRACE_AVAILABLE",
    };

    res.status(500).json(descripcionError);
  }
};

// Eliminar una oferta
export const deleteOffer = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const deletedOffer = await prisma.offer.delete({
      where: { id: Number(id) },
    });

    res.status(200).json(deletedOffer);
  } catch (error) {
    const err = error as Error & { code?: string };
    const descripcionError = {
      message: "Error eliminando la oferta.",
      code: err.code || "SERVER_ERROR",
      stackTrace: err.stack || "NO_STACK_TRACE_AVAILABLE",
    };

    res.status(500).json(descripcionError);
  }
};

// Buscar ofertas por idArea
export const findOffersByArea = async (req: Request, res: Response) => {
  try {
    const { idArea } = req.params;

    const offers = await prisma.offer.findMany({
      where: { idArea: Number(idArea) },
    });

    res.status(200).json(offers);
  } catch (error) {
    const err = error as Error & { code?: string };
    const descripcionError = {
      message: "Error buscando ofertas por área.",
      code: err.code || "SERVER_ERROR",
      stackTrace: err.stack || "NO_STACK_TRACE_AVAILABLE",
    };

    res.status(500).json(descripcionError);
  }
};

// Buscar ofertas por idCategory
export const findOffersByCategory = async (req: Request, res: Response) => {
  try {
    const { idCategory } = req.params;

    const offers = await prisma.offer.findMany({
      where: { idCategory: Number(idCategory) },
    });

    res.status(200).json(offers);
  } catch (error) {
    const err = error as Error & { code?: string };
    const descripcionError = {
      message: "Error buscando ofertas por categoría.",
      code: err.code || "SERVER_ERROR",
      stackTrace: err.stack || "NO_STACK_TRACE_AVAILABLE",
    };

    res.status(500).json(descripcionError);
  }
};

// Buscar ofertas por rango de precios
export const findOffersByPriceRange = async (req: Request, res: Response) => {
  try {
    const { minPrice, maxPrice } = req.query;

    const offers = await prisma.offer.findMany({
      where: {
        price: {
          gte: new Decimal(String(minPrice)), // Mínimo precio
          lte: new Decimal(String(maxPrice)), // Máximo precio
        },
      },
    });

    res.status(200).json(offers);
  } catch (error) {
    const err = error as Error & { code?: string };
    const descripcionError = {
      message: "Error buscando ofertas por rango de precios.",
      code: err.code || "SERVER_ERROR",
      stackTrace: err.stack || "NO_STACK_TRACE_AVAILABLE",
    };

    res.status(500).json(descripcionError);
  }
};

// Buscar ofertas filtrando por un string en name, description o details
export const searchOffers = async (req: Request, res: Response) => {
  try {
    const { searchTerm } = req.query;

    const offers = await prisma.offer.findMany({
      where: {
        OR: [
          { name: { contains: String(searchTerm), mode: "insensitive" } },
          {
            description: { contains: String(searchTerm), mode: "insensitive" },
          },
          { details: { contains: String(searchTerm), mode: "insensitive" } },
        ],
      },
    });

    res.status(200).json(offers);
  } catch (error) {
    const err = error as Error & { code?: string };
    const descripcionError = {
      message: "Error buscando ofertas.",
      code: err.code || "SERVER_ERROR",
      stackTrace: err.stack || "NO_STACK_TRACE_AVAILABLE",
    };

    res.status(500).json(descripcionError);
  }
};
