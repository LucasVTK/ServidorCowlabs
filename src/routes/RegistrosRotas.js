import { Router } from 'express';
import RegistroController from '../controllers/RegistroController.js';
import DemandasController from '../controllers/DemandasController.js';

const router = Router();
router.get('/Allregistros/', RegistroController.MostraTodosOsRegistros)
router.post('/auth/register', RegistroController.registro)

router.post("/demandas/filter/", DemandasController.filterDemandas)

export default router;
