import { Router } from "express";
import ComentariosController from "../controllers/ComentariosController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const ComentariosRoute = Router();

// Listar comentários de uma demanda (público)
ComentariosRoute.get("/demandas/:id/comentarios", ComentariosController.getByDemandaId);

// Criar comentário em uma demanda (requer login)
ComentariosRoute.post("/demandas/:id/comentarios", authMiddleware.authenticate, ComentariosController.create);

export default ComentariosRoute;
