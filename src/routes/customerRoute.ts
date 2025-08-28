import express from 'express';
import customerController from '../controllers/customerController';
import auth from '../middlewares/auth';

const customerRouter = express.Router();

customerRouter
  .route('/')
  .post(auth.verifyAccessToken, auth.verifyUserAuth, customerController.createCustomer)
  .get(auth.verifyAccessToken, auth.verifyUserAuth, customerController.getCustomerList);

export default customerRouter;
