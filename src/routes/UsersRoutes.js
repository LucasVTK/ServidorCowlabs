import { Router } from 'express';
import UserController from '../controllers/UserController.js';
import authMiddleare from '../middleware/authMiddleware.js';
import ModelMiddleware from '../middleware/modelMiddleware.js';

const UserRoute = Router()

UserRoute.get('/admin/users', UserController.getAllUsers)
UserRoute.get('/users/:id',UserController.getUserById)
UserRoute.post('/users/verificaLogin', UserController.verificaLogin)
UserRoute.post('/users/create',ModelMiddleware.modelValidade, ModelMiddleware.modelUpdateSenha, UserController.create)
UserRoute.put('/users/update/:id',ModelMiddleware.modelValidade,UserController.Update)
UserRoute.patch('/users/update_password/:id', ModelMiddleware.modelUpdateSenha,UserController.updatePassword)
// UserRoute.delete('/admin/users/delete/:id', authMiddleare.authenticateAdmin,UserController.delete)

UserRoute.get('/users/:id/ranking', UserController.getUserRanking)
UserRoute.get('/users/:id/activity', UserController.getUserActivity)

export default UserRoute

