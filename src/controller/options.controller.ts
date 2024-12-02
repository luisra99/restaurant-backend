import { Request, Response } from "express";
import { tables } from "../functions/options";

export const getOptions = async (req: Request, res: Response) => {
  try {
    const { concept } = req.params;
    switch (concept) {
      case "tables":
        return res.status(201).json(await tables());
      default:
        throw new Error("El parámetro no es correcto.");
    }
  } catch (error: any) {
    const descripcionError = {
      message: error.message || "Error listando el concepto.",
      code: error.code || "SERVER_ERROR",
      stackTrace: error.stack || "NO_STACK_TRACE_AVAILABLE",
    };
    res.status(500).json(descripcionError);
  }
};
