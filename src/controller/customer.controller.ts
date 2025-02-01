import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";

const prisma = new PrismaClient();

// Listar todos los proveedores/clientes
export const listSupplierCustomers = async (req: Request, res: Response): Promise<void> => {
    try {
        const supplierCustomers = await prisma.supplierCustomer.findMany();
        res.status(200).json(supplierCustomers);
    } catch (error) {
        res.status(500).json({ error: (error as Error).message });
    }
};

// Obtener un proveedor/cliente por ID
export const getSupplierCustomerById = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const supplierCustomer = await prisma.supplierCustomer.findUnique({
            where: { id },
        });

        if (!supplierCustomer) {
            res.status(404).json({ message: "Proveedor/Cliente no encontrado." });
            return;
        }

        res.status(200).json(supplierCustomer);
    } catch (error) {
        res.status(500).json({ error: (error as Error).message });
    }
};

// Crear un nuevo proveedor/cliente
export const createSupplierCustomer = async (req: Request, res: Response): Promise<void> => {
    try {
        const { name, email, phone, address } = req.body;

        const newSupplierCustomer = await prisma.supplierCustomer.create({
            data: {
                name,
                email,
                phone,
                address,
            },
        });

        res.status(201).json(newSupplierCustomer);
    } catch (error) {
        res.status(500).json({ error: (error as Error).message });
    }
};

// Actualizar un proveedor/cliente
export const updateSupplierCustomer = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const { name, email, phone, address } = req.body;

        const updatedSupplierCustomer = await prisma.supplierCustomer.update({
            where: { id },
            data: {
                name,
                email,
                phone,
                address,
            },
        });

        res.status(200).json(updatedSupplierCustomer);
    } catch (error) {
        res.status(500).json({ error: (error as Error).message });
    }
};

// Eliminar un proveedor/cliente
export const deleteSupplierCustomer = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;

        await prisma.supplierCustomer.delete({
            where: { id },
        });

        res.status(200).json({ message: "Proveedor/Cliente eliminado correctamente." });
    } catch (error) {
        res.status(500).json({ error: (error as Error).message });
    }
};