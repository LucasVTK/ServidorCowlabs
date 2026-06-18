import { Router } from "express";
import chamadosController from "../controllers/ChamadosController.js";
import middlewareChamados from "../middleware/middlewareValidaCampos.js";
import authMiddleware from "../middleware/authMiddleware.js";

const chamadosRouter = Router()

chamadosRouter.get('/admin/chamados', authMiddleware.authenticateAdmin, chamadosController.getAllChamados)
chamadosRouter.patch('/admin/chamados/:id/responder', authMiddleware.authenticateAdmin, chamadosController.responderChamado)
chamadosRouter.post('/chamados/create', authMiddleware.authenticate, middlewareChamados.validaCampos, chamadosController.createChamados)
chamadosRouter.post('/mailer/:id', authMiddleware.authenticateAdmin, chamadosController.EnviarEmail)

export default chamadosRouter