import { Router } from "express";
import {createProfesor, deleteProfesor, getProfesorByID, getProfesores, updateProfesor} from '../controller/profesor.controller'

const router = Router();

router.post('/', createProfesor);

router.get('/', getProfesores);

router.get('/:id', getProfesorByID);

router.put('/:id', updateProfesor);

router.delete('/:id', deleteProfesor);

export default router;