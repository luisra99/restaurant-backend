import { Request, Response } from "express";
import { movementType, tables, typeUnitOfMeasure, unitOfMeasure } from "../functions/options";
import { listSupplierCustomers } from "./customer.controller"
import { getStockItem } from "./inventoryItem.controller"
export const getOptions = async (req: Request, res: Response) => {
  try {
    const { concept } = req.params;
    switch (concept) {
      case "tables":
        return res.status(201).json(await tables());
      case "movementType":
        return res.status(201).json(await movementType());
      case "unitOfMeasure":
        return res.status(201).json([{ id: "units", denomination: "Unidades" }, { id: "mass", denomination: "Masa" }, { id: "volume", denomination: "Volúmen" }, { id: "distance", denomination: "Distancia" }]);
      case "units":
        return res.status(201).json(await unitOfMeasure("Unidades"));
      case "mass":
        return res.status(201).json(await unitOfMeasure("Masa"));
      case "volume":
        return res.status(201).json(await unitOfMeasure("Volúmen"));
      case "distance":
        return res.status(201).json(await unitOfMeasure("Distancia"));
      case "stock-item":
        return getStockItem(req, res);
      case "supplier-costumer":
        return listSupplierCustomers(req, res);
      default:
        throw new Error("El parámetro no es correcto.");
    }
  } catch (error: any) {
    const descriptionError = {
      message: error.message || "Error listando el concepto.",
      code: error.code || "SERVER_ERROR",
      stackTrace: error.stack || "NO_STACK_TRACE_AVAILABLE",
    };
    res.status(500).json(descriptionError);
  }
};
