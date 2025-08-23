import express from 'express';
import contractController from '../controllers/contractController';

const contractRouter = express.Router();

contractRouter.route('/').post(contractController.createContract);

contractRouter.route('/cars').get(contractController.getCarsForContract);

contractRouter.route('/customers').get(contractController.getCustomersForContract);

contractRouter.route('/users').get(contractController.getUsersForContract);

contractRouter.route('/:contractId');

export default contractRouter;
