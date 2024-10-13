import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const createCategoria = async (req: Request, res: Response) => {
  try {
    const { categoria } = req.body;

    const newCategoria = await prisma.categoria.create({
      data: {
        categoria,
      },
    });

    res.status(201).json(newCategoria);
  } catch (error) {
    const err = error as Error & { code?: string };
      const descripcionError = {
        message: "Ha ocurrido un error creando la categoria.",
        code: err.code || 'SERVER_ERROR',
        stackTrace: err.stack || 'NO_STACK_TRACE_AVAILABLE'
      };
  
      res.status(500).json(descripcionError);
  }
};

export const getCategorias = async (req: Request, res: Response) => {
  try {
    const categorias = await prisma.categoria.findMany({
      include: {
        Curso: true,
      },
    });

    res.status(200).json(categorias);
  } catch (error) {
    const err = error as Error & { code?: string };
      const descripcionError = {
        message: "Ha ocurrido un error obteniendo las categorias.",
        code: err.code || 'SERVER_ERROR',
        stackTrace: err.stack || 'NO_STACK_TRACE_AVAILABLE'
      };
  
      res.status(500).json(descripcionError);
  }
};

export const getCategoriaByID = async (req: Request, res: Response) => {
  try {
    const idCategoria = req.params.id;

    const categoria = await prisma.categoria.findUnique({
      where: {
        idCategoria: parseInt(idCategoria),
      },
      include: {
        Curso: true,
      },
    });

    if (!categoria) {
      return res.status(404).json({ message: "Categoría no encontrada" });
    }

    res.status(200).json(categoria);
  } catch (error) {
    const err = error as Error & { code?: string };
    const descripcionError = {
      message: "Ha ocurrido un error obteniendo la categoria.",
      code: err.code || 'SERVER_ERROR',
      stackTrace: err.stack || 'NO_STACK_TRACE_AVAILABLE'
    };

    res.status(500).json(descripcionError);
  }
};

export const updateCategoria = async (req: Request, res: Response) => {
  try {
    const idCategoria = req.params.id;
    const {categoria } = req.body;

    await prisma.categoria.update({
      where: {
        idCategoria: parseInt(idCategoria),
      },
      data: {
        categoria,
      },
    });

    res.status(200).json({
      message: "Categoria actualizada correctamente."
    });
  } catch (error) {
    const err = error as Error & { code?: string };
    const descripcionError = {
      message: "Ha ocurrido un error actualizando la categoria.",
      code: err.code || 'SERVER_ERROR',
      stackTrace: err.stack || 'NO_STACK_TRACE_AVAILABLE'
    };

    res.status(500).json(descripcionError);
  }
};

export const deleteCategoria = async (req: Request, res: Response) => {
  try {
    const idCategoria = req.params.id;

    const categoriaEliminada = await prisma.categoria.delete({
      where: {
        idCategoria: parseInt(idCategoria),
      },
    });

    if (!categoriaEliminada) {
      return res.status(404).json({ message: "Categoría no encontrada" });
    }

    res.status(200).json({ message: "Categoría eliminada" });
  } catch (error) {
    const err = error as Error & { code?: string };
      const descripcionError = {
        message: "Ha ocurrido un error eliminando la categoria.",
        code: err.code || 'SERVER_ERROR',
        stackTrace: err.stack || 'NO_STACK_TRACE_AVAILABLE'
      };
  
      res.status(500).json(descripcionError);
  }
};
