import express from 'express';
import customerController from '../controllers/customerController';
import auth from '../middlewares/auth';
import { csvParse } from '../middlewares/csvParse';
import { uploadCSV } from '../middlewares/csvUpload';

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

customerRouter
  .route('/upload')
  .post(
    auth.verifyAccessToken,
    auth.verifyUserAuth,
    uploadCSV.single('file'),
    csvParse,
    customerController.createManyCustomerList,
  );

export default customerRouter;
