import { Router } from 'express';
import RegistroController from '../controllers/RegistroController.js';
import DemandasController from '../controllers/DemandasController.js';
import preparaDemandas from '../middleware/middlewareDemandas.js'
import middlewareFiltroDemandas from '../middleware/middlewareDemandas.js';

const router = Router();
router.get('/Allregistros/', RegistroController.MostraTodosOsRegistros)
router.post('/auth/register', RegistroController.registro)

router.post("/demandas/filter/", middlewareFiltroDemandas.preparaDemanda , DemandasController.filterDemandas)

export default router;
