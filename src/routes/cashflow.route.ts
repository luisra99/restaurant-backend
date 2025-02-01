import { Router } from 'express';
import { createCashFlow, updateCashFlow, deleteCashFlow, getCashFlows, getBalance } from '../controller/cashflow.controller';

const router = Router();

router.post('/cashflow', createCashFlow);
router.get('/cashflow', getCashFlows);
router.get('/cashflow/balance', getBalance);
router.put('/cashflow/:id', updateCashFlow);
router.delete('/cashflow/:id', deleteCashFlow);

export default router;