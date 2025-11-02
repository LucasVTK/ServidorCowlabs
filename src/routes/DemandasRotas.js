import { Router } from 'express';
import CrudDemandaController from '../controllers/CrudDemandaController.js';

const Demandarouter = Router();

Demandarouter.get('/demandas', CrudDemandaController.getAllDemandas);
Demandarouter.get('/demandas/id/:id', CrudDemandaController.getDemandasById);
Demandarouter.get('/demandas/tag/:demanda_tag', CrudDemandaController.getDemandasByTag);
Demandarouter.post('/demandas/create', CrudDemandaController.creatDemandas);
Demandarouter.put('/demandas/update/:id', CrudDemandaController.updateDemandas);
Demandarouter.delete('/demandas/delete/:id', CrudDemandaController.deleteDemandas);

export default Demandarouter;