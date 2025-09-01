import express from 'express';
import dashboardController from '../controllers/dashboardController';
import auth from '../middlewares/auth';

const dashboardRouter = express.Router();

dashboardRouter
  .route('/')
  .get(auth.verifyAccessToken, auth.verifyUserAuth, dashboardController.getDashboardData);

export default dashboardRouter;
