import { Request, Response } from 'express';
import { carDTO, carListDTO } from '../types/carType';
import carService from '../services/carService';
import { createCarSchema, getCarListSchema, getCarSchema } from '../validators/carValidator';
import { CustomError } from '../utils/customErrorUtil';
import { CarStatus } from '../generated/prisma';
import { validator } from '../validators/utilValidator';

class CarController {
  getCar = async (req: Request, res: Response) => {
    const carId = parseInt(req.params.carId, 10);
    validator({ carId }, getCarSchema);
    const car = await carService.getCar(carId);
    return res.status(200).json(car);
  };

  getCarList = async (req: Request, res: Response) => {
    const query = {
      ...req.query,
      page: Number(req.query.page) | 1,
      pageSize: Number(req.query.pageSize) | 8,
    };
    validator(query, getCarListSchema);
    if (!req.user) {
      throw CustomError.unauthorized();
    }
    const user = req.user.userId;
    const { page = 1, pageSize = 8, status = '', searchBy = 'carNumber', keyword = '' } = req.query;
    const params: carListDTO = {
      page: Number(page),
      pageSize: Number(pageSize),
      status: status as CarStatus,
      searchBy: searchBy as 'carNumber' | 'model',
      keyword: keyword as string,
    };
    const cars = await carService.getCarList(params, user);
    return res.status(200).json(cars);
  };

  createCar = async (req: Request<{}, {}, carDTO>, res: Response) => {
    validator(req.body, createCarSchema);
    if (!req.user) {
      throw CustomError.unauthorized();
    }
    const user = Number(req.user.userId);
    const data = req.body;
    const createdCar = await carService.createCar(data, user);
    return res.status(201).json(createdCar);
  };

  // updateCar = async (req: Request, res: Response) => {
  //   const carId = Number(req.params);
  //   const car = await carService.getCar(carId);
  //   const updatedCar =
  // };
}

export default new CarController();
