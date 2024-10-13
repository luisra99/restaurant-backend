import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();


export const nomeclator = async (req: Request, res: Response) => {
  const model = req.params.model;

  try {
    let data: Array<{ id?: number, idEstado?: number, idCategoria?: number, nombre?: string, denominacion?: boolean | string, estado?: string | boolean, categoria?: string }>;

    switch (model) {
      case "Sede":
        data = await prisma.sede.findMany({
          select: {
            id: true,
            nombre: true,
          },
        });
        break;
      case "Horario":
        data = await prisma.horario.findMany({
          select: {
            id: true,
            denominacion: true,
          },
        });
        break;
      case "Profesor":
        data = await prisma.profesor.findMany({
          select: {
            id: true,
            nombre: true,
          },
        });
        break;
      case "Estado":
        data = await prisma.estado.findMany({
          select: {
            idEstado: true,
            denominacion: true,
          },
        });
        break;
      case "EsatdoDeSolicitud":
        data = await prisma.esatdoDeSolicitud.findMany({
          select: {
            idEstado: true,
            estado: true,
          },
        });
        break;
      case "TipoDeCurso":
        data = await prisma.tipoDeCurso.findMany({
          select: {
            id: true,
            denominacion: true,
          },
        });
        break;
      case "Categoria":
        data = await prisma.categoria.findMany({
          select: {
            idCategoria: true,
            categoria: true,
          },
        });
        break;
      default:
        return res.status(400).json({ error: "Modelo no válido" });
    }

    const result = data.map((item) => ({
      value: item.id || item.idEstado || item.idCategoria,
      label: item.nombre || item.denominacion || item.categoria || item.estado,
    }));

    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener datos" });
  }
};
