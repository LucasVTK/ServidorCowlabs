import { Router } from 'express';
import CrudDemandaController from '../controllers/CrudDemandaController.js';
import middlewareDemandas from '../middleware/middlewareDemandas.js'
import authMiddleare from '../middleware/authMiddleware.js';

const Demandarouter = Router();

Demandarouter.get('/demandas', CrudDemandaController.getAllDemandas);
Demandarouter.get('/demandas/id/:id', middlewareDemandas.verificarIdValido, CrudDemandaController.getDemandasById);
Demandarouter.get('/demandas/tag/:demanda_tag', middlewareDemandas.verificarTagValida, CrudDemandaController.getDemandasByTag);
Demandarouter.post('/demandas/create', middlewareDemandas.verificarCamposdaDemanda, middlewareDemandas.verificarTiposDeDados, middlewareDemandas.verificarComprimento, CrudDemandaController.creatDemandas);
Demandarouter.put('/demandas/update/:id', middlewareDemandas.verificarIdValido, middlewareDemandas.verificarCamposdaDemanda, middlewareDemandas.verificarTiposDeDados, middlewareDemandas.verificarComprimento, CrudDemandaController.updateDemandas);
Demandarouter.delete('/demandas/delete/:id', middlewareDemandas.verificarIdValido, CrudDemandaController.deleteDemandas);

export default Demandarouter;