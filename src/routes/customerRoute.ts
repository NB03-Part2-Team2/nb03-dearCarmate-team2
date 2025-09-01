import express from 'express';
import customerController from '../controllers/customerController';
import auth from '../middlewares/auth';

const customerRouter = express.Router();

customerRouter
  .route('/')
  .post(auth.verifyAccessToken, auth.verifyUserAuth, customerController.createCustomer)
  .get(auth.verifyAccessToken, auth.verifyUserAuth, customerController.getCustomerList);
customerRouter
  .route('/:customerId')
  .get(auth.verifyAccessToken, auth.verifyUserAuth, customerController.getCustomer)
  .patch(auth.verifyAccessToken, auth.verifyUserAuth, customerController.updateCustomer)
  .delete(auth.verifyAccessToken, auth.verifyUserAuth, customerController.deleteCustomer);

export default customerRouter;
