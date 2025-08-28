import express from 'express';
import contractController from '../controllers/contractController';
import auth from '../middlewares/auth';

const contractRouter = express.Router();

contractRouter
  .route('/')
  .post(auth.verifyAccessToken, auth.verifyUserAuth, contractController.createContract)
  .get(auth.verifyAccessToken, auth.verifyUserAuth, contractController.getContractListInCompany);

contractRouter
  .route('/cars')
  .get(auth.verifyAccessToken, auth.verifyUserAuth, contractController.getCarListForContract);

contractRouter
  .route('/customers')
  .get(auth.verifyAccessToken, auth.verifyUserAuth, contractController.getCustomerListForContract);

contractRouter
  .route('/users')
  .get(auth.verifyAccessToken, auth.verifyUserAuth, contractController.getUserListForContract);

contractRouter
  .route('/:contractId')
  .patch(auth.verifyAccessToken, auth.verifyUserAuth, contractController.updateContract)
  .delete(auth.verifyAccessToken, auth.verifyUserAuth, contractController.deleteContract);

export default contractRouter;
