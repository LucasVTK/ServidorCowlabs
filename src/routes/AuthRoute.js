import { Router } from "express";
import AuthController from "../controllers/AuthController.js";
import ModelMiddleware from "../middleware/modelMiddleware.js";


const AuthRoute = Router()

AuthRoute.post('/login', AuthController.login)


export default AuthRoute