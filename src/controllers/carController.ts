import { Request, Response } from 'express';
import { carDTO } from '../types/carType';
import carService from '../services/carService';
import { createCarValidator } from '../validators/carValidator';
import { CustomError } from '../utils/customErrorUtil';

class CarController {
  getCar = async (req: Request, res: Response) => {
    const carId = Number(req.params.carId);
    const car = await carService.getCar(carId);
    return res.status(200).json(car);
  };
  createCar = async (req: Request<{}, {}, carDTO>, res: Response) => {
    if (!req.user) {
      throw CustomError.unauthorized();
    }
    const user = req.user.userId;
    const data = req.body;
    createCarValidator(data);
    const createdCar = await carService.createCar(data, user);
    return res.status(201).json(createdCar);
  };
}

export default new CarController();
