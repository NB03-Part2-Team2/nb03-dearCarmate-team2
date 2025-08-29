import { Request, Response } from 'express';
import { carDTO, carListDTO, carUpdateDTO } from '../types/carType';
import carService from '../services/carService';
import {
  createCarSchema,
  getCarListSchema,
  getCarSchema,
  updateCarSchema,
} from '../validators/carValidator';
import { CustomError } from '../utils/customErrorUtil';
import { CarStatus } from '../generated/prisma';
import { validator } from '../validators/utilValidator';

class CarController {
  getCar = async (req: Request, res: Response) => {
    const carId = parseInt(req.params.carId, 10);
    if (!carId) {
      throw CustomError.notFound('존재하지 않는 차량입니다.');
    }
    validator({ carId }, getCarSchema);
    const rawCar = await carService.getCar(carId);
    const car = {
      id: rawCar.id,
      carNumber: rawCar.carNumber,
      manufacturer: rawCar.carModel.manufacturer,
      model: rawCar.carModel.model,
      type: rawCar.carModel.type,
      manufacturingYear: rawCar.manufacturingYear,
      mileage: rawCar.mileage,
      price: rawCar.price,
      accidentCount: rawCar.accidentCount,
      explanation: rawCar.explanation,
      accidentDetails: rawCar.accidentDetails,
      status: rawCar.status,
    };
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
    const rawCar = await carService.createCar(data, user);
    const createdCar = {
      id: rawCar.id,
      carNumber: rawCar.carNumber,
      manufacturer: rawCar.carModel.manufacturer,
      model: rawCar.carModel.model,
      type: rawCar.carModel.type,
      manufacturingYear: rawCar.manufacturingYear,
      mileage: rawCar.mileage,
      price: rawCar.price,
      accidentCount: rawCar.accidentCount,
      explanation: rawCar.explanation,
      accidentDetails: rawCar.accidentDetails,
      status: rawCar.status,
    };
    return res.status(201).json(createdCar);
  };

  //validator 오류 수정 필요
  updateCar = async (req: Request, res: Response) => {
    // validator(req.body, updateCarSchema);
    const carId = parseInt(req.params.carId, 10);
    if (!carId) {
      throw CustomError.notFound('존재하지 않는 차량입니다.');
    }
    const data: carUpdateDTO = req.body;
    const rawCar = await carService.updateCar(data, carId);
    const updatedCar = {
      id: rawCar.id,
      carNumber: rawCar.carNumber,
      manufacturer: rawCar.carModel.manufacturer,
      model: rawCar.carModel.model,
      type: rawCar.carModel.type,
      manufacturingYear: rawCar.manufacturingYear,
      mileage: rawCar.mileage,
      price: rawCar.price,
      accidentCount: rawCar.accidentCount,
      explanation: rawCar.explanation,
      accidentDetails: rawCar.accidentDetails,
      status: rawCar.status,
    };
    return res.status(200).json(updatedCar);
  };

  deleteCar = async (req: Request, res: Response) => {
    const carId = parseInt(req.params.carId, 10);
    if (!carId) {
      throw CustomError.notFound('존재하지 않는 차량입니다.');
    }
    await carService.deleteCar(carId);
    return res.json(200);
  };
}

export default new CarController();
