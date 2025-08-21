import express from 'express';
import contractController from '../controllers/contractController';

const contractRouter = express.Router()

contractRouter.route('/')

contractRouter.route('/cars')
  .get(contractController.getCarsForContract)
contractRouter.route('/customers')

contractRouter.route('/users')

contractRouter.route('/:contractId')