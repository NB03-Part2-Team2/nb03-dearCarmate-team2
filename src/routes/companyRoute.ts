import express, { Router } from 'express';
import companyController from '../controllers/companyController';
import auth from '../middlewares/auth';

const companyRouter: Router = express.Router();

companyRouter
  .route('/')
  .post(auth.verifyAccessToken, auth.verifyAdminAuth, companyController.createCompany);

companyRouter
  .route('/:companyId')
  .patch(auth.verifyAccessToken, auth.verifyAdminAuth, companyController.updateCompany)
  .delete(auth.verifyAccessToken, auth.verifyAdminAuth, companyController.deleteCompany);

export default companyRouter;
