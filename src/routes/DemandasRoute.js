import { Router } from "express";
import CrudDemandaController from "../controllers/CrudDemandaController.js";
import  middlewareDemandas from '../middleware/middlewareDemandas.js'

const DemandasRouter = Router()

DemandasRouter.get('/demandas', CrudDemandaController.getAllDemandas)
DemandasRouter.get('/demandas/id/:id', middlewareDemandas.verificarIdValido,CrudDemandaController.getDemandasById)
DemandasRouter.get('/demandas/tag/:demanda_tag', middlewareDemandas.verificarTagValida, CrudDemandaController.getDemandasByTag)
DemandasRouter.post('/demandas/creat', middlewareDemandas.verificarCamposdaDemanda, CrudDemandaController.creatDemandas)
DemandasRouter.put('/demandas/update/:id', middlewareDemandas.verificarIdValido,middlewareDemandas.verificarCamposdaDemanda, middlewareDemandas.verificarTiposDeDados, middlewareDemandas.verificarComprimento, CrudDemandaController.updateDemandas)
DemandasRouter.delete('/demandas/delete/:id', middlewareDemandas.verificarIdValido, CrudDemandaController.deleteDemandas)

export default DemandasRouter