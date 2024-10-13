import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

const prisma = new PrismaClient();

export const createCertificate = async (req: Request, res: Response) => {
    try{
        const{ idCourse, idUser } = req.params

        const file = req.file

        await prisma.certificado.create({
            data:{
                path: `http://localhost:4000/public/certificate${file?.fieldname}`,
                Curso: {
                    connect: {
                      id: parseInt(idCourse),
                    },
                },
                Usuario: {
                    connect: {
                      username: idUser,
                    },
                },
            }
        })

        res.status(200).json({
            message: "Certificado creado"
        })

    }catch(error){
        const err = error as Error & { code?: string };
        const descripcionError = {
        message: "Ha ocurrido un error creando el certificado.",
        code: err.code || 'SERVER_ERROR',
        stackTrace: err.stack || 'NO_STACK_TRACE_AVAILABLE'
      };
  
      res.status(500).json(descripcionError);
    }
}