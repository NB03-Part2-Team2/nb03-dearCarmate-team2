import { Request, Response } from 'express';
import { carDTO } from '../types/carType';
import carService from '../services/carService';

class CarController {
  getCar = async (req: Request, res: Response) => {
    const carId = Number(req.params.carId);
    const car = await carService.getCar(carId);
  };
  createCar = async (req: Request<{}, {}, carDTO>, res: Response) => {
    const user = req.user!.userId;
    const data = req.body;
    const createdCar = await carService.createCar(data, user);
    res.status(201).json(createdCar);
  };
}

export default new CarController();
