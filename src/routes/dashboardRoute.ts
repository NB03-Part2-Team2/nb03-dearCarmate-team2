import express from 'express';
import dashboardController from '../controllers/dashboardController';
import auth from '../middlewares/auth';
import { performanceLogger } from '../middlewares/performanceLogger';

const dashboardRouter = express.Router();

// 성능 측정 미들웨어 적용
dashboardRouter.use(performanceLogger);

dashboardRouter
  .route('/')
  .get(auth.verifyAccessToken, auth.verifyUserAuth, dashboardController.getDashboardData);

export default dashboardRouter;
