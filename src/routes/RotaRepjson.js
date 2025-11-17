import { Router } from "express";
import authController from "../controllers/ControllerLoginJson.js";

const RotaRepJson = Router()

RotaRepJson.post('/loginJson', authController.loginJson)

export default RotaRepJson