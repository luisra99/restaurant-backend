import { Router } from "express";
import {createCategoria, deleteCategoria, getCategoriaByID, getCategorias, updateCategoria} from '../controller/categoria.controller'

const router = Router();

router.post('/', createCategoria);

router.get('/', getCategorias);

router.get('/:id', getCategoriaByID);

router.put('/:id', updateCategoria);

router.delete('/:id', deleteCategoria);

export default router;
