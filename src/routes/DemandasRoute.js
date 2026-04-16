import { Router } from "express";
import CrudDemandaController from "../controllers/CrudDemandaController.js";
import middlewareDemandas from '../middleware/middlewareDemandas.js'
import authMiddleware from "../middleware/authMiddleware.js";

const DemandasRouter = Router()

DemandasRouter.get('/demandas', CrudDemandaController.getAllDemandas)
DemandasRouter.get('/demandas/id/:id', middlewareDemandas.verificarIdValido,CrudDemandaController.getDemandasById)
DemandasRouter.get('/demandas/tag/:demanda_tag', middlewareDemandas.verificarTagValida, CrudDemandaController.getDemandasByTag) // arrumar rota demanda_tag

DemandasRouter.post(
  '/demandas/create',
  authMiddleware.authenticate,
  middlewareDemandas.verificarCamposdaDemanda,
  middlewareDemandas.verificarTiposDeDados,
  middlewareDemandas.verificarComprimento,
  CrudDemandaController.creatDemandas
);
DemandasRouter.put(
  "/demandas/:id",
  authMiddleware.authenticate,
 middlewareDemandas.verificarDonoDaDemanda,
  CrudDemandaController.updateDemanda
);
DemandasRouter.delete(
  "/demandas/:id",
  authMiddleware.authenticate,
  middlewareDemandas.verificarDonoDaDemanda,
  CrudDemandaController.deleteDemanda
);

export default DemandasRouter
