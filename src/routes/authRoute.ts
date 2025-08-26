import express, { Router } from 'express';
import authController from '../controllers/authController';
import auth from '../middlewares/auth';

const authRouter: Router = express.Router();

authRouter.route('/login').post(authController.login);
authRouter.route('/refresh').post(auth.verifyRefreshToken, authController.updateToken);

export default authRouter;
