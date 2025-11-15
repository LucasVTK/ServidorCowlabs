import { Router } from 'express';
import UserController from '../controllers/UserController.js';
import authMiddleare from '../middleware/authMiddleware.js';
import ModelMiddleware from '../middleware/modelMiddleware.js';

const UserRoute = Router()

UserRoute.get('/admin/users',authMiddleare.authenticateAdmin, UserController.getAllUsers)
UserRoute.get('/users/:id',UserController.getUserById)
UserRoute.post('/users/create',UserController.insert)
UserRoute.put('/users/update/:id',ModelMiddleware.modelValidade,UserController.Update)
UserRoute.patch('/users/update_password/:id', ModelMiddleware.modelUpdateSenha,UserController.updatePassword)
// UserRoute.delete('/admin/users/delete/:id', authMiddleare.authenticateAdmin,UserController.delete)

export default UserRoute

