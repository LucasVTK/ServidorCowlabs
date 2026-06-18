import { Router } from "express";
import AuthController from "../controllers/AuthController.js";



const AuthRoute = Router()

AuthRoute.post('/login', AuthController.login)


export default AuthRoute