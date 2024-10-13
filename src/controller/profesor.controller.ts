import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const createProfesor = async (req: Request, res: Response) => {
  try {
    const {
      nombre,
      p_apellido,
      s_apellido,
      idSede,
      email,
      descripcion,
    } = req.body;

     await prisma.profesor.create({
      data: {
        nombre,
        p_apellido,
        s_apellido,
        email,
        descripcion,
        Profesor_Sede: {
          connect: {
            id: idSede, // Conectamos la relación usando el ID de la sede
          },
        },
      },
    });

    res.status(200).json({ message: "Profesor creado con éxito." });
  } catch (error) {
    const err = error as Error & { code?: string };
    const descripcionError = {
      message: "Ha ocurrido un error creando el profesor.",
      code: err.code || 'SERVER_ERROR',
      stackTrace: err.stack || 'NO_STACK_TRACE_AVAILABLE'
    };

    res.status(500).json(descripcionError);
  }
};
export const getProfesores = async (req: Request, res: Response) => {
    try {
      const profesores = await prisma.profesor.findMany({
        include: {
          Profesor_Sede: true,
          Cursos: true,
        },
      });
  
      res.status(200).json(profesores);
    } catch (error) {
      const err = error as Error & { code?: string };
      const descripcionError = {
        message: "Ha ocurrido un error obteniendo los profesores.",
        code: err.code || 'SERVER_ERROR',
        stackTrace: err.stack || 'NO_STACK_TRACE_AVAILABLE'
      };
  
      res.status(500).json(descripcionError);
    }
  };
  export const getProfesorByID = async (req: Request, res: Response) => {
    try {
      const idProfesor = req.params.id;
  
      const profesor = await prisma.profesor.findUnique({
        where: {
          id: parseInt(idProfesor),
        },
        include: {
          Profesor_Sede: true,
          Cursos: true,
        },
      });
  
      if (!profesor) {
        return res.status(404).json({ message: "Profesor no encontrado" });
      }
  
      res.status(200).json(profesor);
    } catch (error) {
      const err = error as Error & { code?: string };
      const descripcionError = {
        message: "Ha ocurrido un error obteniendo el profesor.",
        code: err.code || 'SERVER_ERROR',
        stackTrace: err.stack || 'NO_STACK_TRACE_AVAILABLE'
      };
  
      res.status(500).json(descripcionError);
    }
  };
    

  export const updateProfesor = async (req: Request, res: Response) => {
    try {
      const dataProfesor = req.body;
      const idProfesor = req.params.id;
  
      const updatedProfesor = await prisma.profesor.update({
        where: {
          id: parseInt(idProfesor),
        },
        data: dataProfesor,
      });
  
      if (!updatedProfesor) {
        return res.status(404).json({ message: "Profesor no encontrado." });
      }
  
      res.status(200).json({ message: "Profesor actualizado con éxito." });
    } catch (error) {
      const err = error as Error & { code?: string };
      const descripcionError = {
        message: "Ha ocurrido un error actualizando el profesor.",
        code: err.code || 'SERVER_ERROR',
        stackTrace: err.stack || 'NO_STACK_TRACE_AVAILABLE'
      };
  
      res.status(500).json(descripcionError);
    }
  };
  export const deleteProfesor = async (req: Request, res: Response) => {
    try {
      const id = req.params.id;
  
      const profesorEliminado = await prisma.profesor.delete({
        where: {
          id: parseInt(id),
        },
      });
  
      if (!profesorEliminado) {
        return res.status(404).json({ message: "Profesor no encontrado." });
      }
  
      res.status(200).json({ message: "Profesor eliminado con éxito." });
    } catch (error) {
      const err = error as Error & { code?: string };
      const descripcionError = {
        message: "Ha ocurrido un error eliminando el profesor.",
        code: err.code || 'SERVER_ERROR',
        stackTrace: err.stack || 'NO_STACK_TRACE_AVAILABLE'
      };
  
      res.status(500).json(descripcionError);
    }
  };
    