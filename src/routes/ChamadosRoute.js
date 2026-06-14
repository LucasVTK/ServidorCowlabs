import { Router } from "express";
import chamadosController from "../controllers/ChamadosController.js";
import middlewareChamados from "../middleware/middlewareValidaCampos.js";
import authMiddleware from "../middleware/authMiddleware.js";

const chamadosRouter = Router()

chamadosRouter.get('/admin/chamados', chamadosController.getAllChamados)
chamadosRouter.post('/chamados/create',authMiddleware.authenticate, middlewareChamados.validaCampos, chamadosController.createChamados)

export default chamadosRouter