import { Router } from 'express';
import { listSupplierCustomers, getSupplierCustomerById, createSupplierCustomer, updateSupplierCustomer, deleteSupplierCustomer } from '../controller/customer.controller';

const router = Router();

router.get('/supplier-customers', listSupplierCustomers);
router.get('/supplier-customers/:id', getSupplierCustomerById);
router.post('/supplier-customers', createSupplierCustomer);
router.put('/supplier-customers/:id', updateSupplierCustomer);
router.delete('/supplier-customers/:id', deleteSupplierCustomer);

export default router;