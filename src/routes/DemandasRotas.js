import { Router } from 'express';
import CrudDemandaController from '../controllers/CrudDemandaController.js';
import middlewareDemandas from '../middleware/middlewareDemandas.js'

const Demandarouter = Router();

Demandarouter.get('/demandas',CrudDemandaController.getAllDemandas);
Demandarouter.get('/demandas/id/:id', CrudDemandaController.getDemandasById);
Demandarouter.get('/demandas/tag/:demanda_tag', CrudDemandaController.getDemandasByTag);
Demandarouter.post('/demandas/create',middlewareDemandas.verificarCamposdaDemanda, CrudDemandaController.creatDemandas);
Demandarouter.put('/demandas/update/:id',middlewareDemandas.verificarCamposdaDemanda, CrudDemandaController.updateDemandas);
Demandarouter.delete('/demandas/delete/:id', CrudDemandaController.deleteDemandas);

export default Demandarouter;