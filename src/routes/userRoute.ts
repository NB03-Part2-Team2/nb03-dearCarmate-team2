import express, { Router } from 'express';
import userController from '../controllers/userController';
import auth from '../middlewares/auth';

const userRouter: Router = express.Router();

userRouter.route('/').post(userController.createUser);

userRouter
  .route('/me')
  .get(auth.verifyAccessToken, auth.verifyUserAuth, userController.getUser)
  .post(auth.verifyAccessToken, auth.verifyUserAuth, userController.updateUser)
  .delete(auth.verifyAccessToken, auth.verifyUserAuth, userController.deleteUser);

export default userRouter;
