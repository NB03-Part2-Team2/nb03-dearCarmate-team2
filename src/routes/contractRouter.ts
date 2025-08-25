import express from 'express';
import contractController from '../controllers/contractController';
import auth from '../middlewares/auth';

const contractRouter = express.Router();

contractRouter
  .route('/')
  .post(auth.verifyAccessToken, auth.verifyUserAuth, contractController.createContract);

contractRouter
  .route('/cars')
  .get(auth.verifyAccessToken, auth.verifyUserAuth, contractController.getCarsForContract);

contractRouter
  .route('/customers')
  .get(auth.verifyAccessToken, auth.verifyUserAuth, contractController.getCustomersForContract);

contractRouter
  .route('/users')
  .get(auth.verifyAccessToken, auth.verifyUserAuth, contractController.getUsersForContract);

contractRouter.route('/:contractId');

export default contractRouter;
