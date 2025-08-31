import express from 'express';
import auth from '../middlewares/auth';
import carController from '../controllers/carController';

const carRouter = express.Router();

carRouter
  .route('/')
  .post(auth.verifyAccessToken, auth.verifyUserAuth, carController.createCar)
  .get(auth.verifyAccessToken, auth.verifyUserAuth, carController.getCarList);

carRouter
  .route('/:carId')
  .get(auth.verifyAccessToken, auth.verifyUserAuth, carController.getCar)
  .patch(auth.verifyAccessToken, auth.verifyUserAuth, carController.updateCar)
  .delete(auth.verifyAccessToken, auth.verifyUserAuth, carController.deleteCar);

// carRouter.route('/upload').post();

// carRouter.route('/models').get();

export default carRouter;
