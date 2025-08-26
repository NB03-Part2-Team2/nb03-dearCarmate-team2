import express, { Router } from 'express';
import userController from '../controllers/userController';
import auth from '../middlewares/auth';

const userRouter: Router = express.Router();

userRouter.route('/').post(userController.createUser);

export default userRouter;
