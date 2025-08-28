import express from 'express';
import auth from '../middlewares/auth';
import carController from '../controllers/carController';

const carRouter = express.Router();

carRouter
  .route('/')
  .post(auth.verifyAccessToken, auth.verifyUserAuth, carController.createCar)
  .get(carController.getCarList);

carRouter.route('/:carId').get(carController.getCar);
// .patch().delete();

// carRouter.route('/upload').post();

// carRouter.route('/models').get();

export default carRouter;
