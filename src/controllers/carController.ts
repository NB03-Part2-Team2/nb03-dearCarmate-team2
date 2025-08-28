import { Request, Response } from 'express';
import { carDTO, carListDTO } from '../types/carType';
import carService from '../services/carService';
import { createCarValidator } from '../validators/carValidator';
import { CustomError } from '../utils/customErrorUtil';
import { CarStatus } from '../generated/prisma';

class CarController {
  getCar = async (req: Request, res: Response) => {
    const carId = Number(req.params.carId);
    const car = await carService.getCar(carId);
    return res.status(200).json(car);
  };

  getCarList = async (req: Request, res: Response) => {
    const { page = 1, pageSize = 8, status = '', searchBy = 'carNumber', keyword = '' } = req.query;
    const params: carListDTO = {
      page: Number(page),
      pageSize: Number(pageSize),
      status: status as CarStatus,
      searchBy: searchBy as 'carNumber' | 'model',
      keyword: keyword as string,
    };
    const cars = await carService.getCarList(params);
    return res.status(200).json(cars);
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
