import { csvParse } from '../middlewares/csvParse';
import { uploadCSV } from '../middlewares/csvUpload';
import express from 'express';
import auth from '../middlewares/auth';
import carController from '../controllers/carController';

const carRouter = express.Router();

carRouter
  .route('/')
  .post(auth.verifyAccessToken, auth.verifyUserAuth, carController.createCar)
  .get(auth.verifyAccessToken, auth.verifyUserAuth, carController.getCarList);

carRouter
  .route('/models')
  .get(auth.verifyAccessToken, auth.verifyUserAuth, carController.getCarModelList);

carRouter
  .route('/:carId')
  .get(auth.verifyAccessToken, auth.verifyUserAuth, carController.getCar)
  .patch(auth.verifyAccessToken, auth.verifyUserAuth, carController.updateCar)
  .delete(auth.verifyAccessToken, auth.verifyUserAuth, carController.deleteCar);

carRouter
  .route('/upload')
  .post(
    auth.verifyAccessToken,
    auth.verifyUserAuth,
    uploadCSV.single('file'),
    csvParse,
    carController.uploadCarList,
  );

export default carRouter;
