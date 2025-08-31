import { Request, Response } from 'express';
import { carDTO, carListDTO, carUpdateDTO } from '../types/carType';
import carService from '../services/carService';
import {
  createCarSchema,
  getCarListSchema,
  getCarSchema,
  intIdSchema,
  updateCarSchema,
} from '../validators/carValidator';
import { CustomError } from '../utils/customErrorUtil';
import { CarStatus } from '../generated/prisma';
import { validator } from '../validators/utilValidator';

class CarController {
  getCar = async (req: Request, res: Response) => {
    validator(req.params.carId, intIdSchema);
    const carId = parseInt(req.params.carId, 10);
    validator({ carId }, getCarSchema);
    if (!req.user) {
      throw CustomError.unauthorized();
    }
    const userId = req.user.userId;
    const rawCar = await carService.getCar(carId, userId);
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
    const rawCars = await carService.getCarList(params, user);
    console.log(rawCars);
    const cars = rawCars.data.map((car) => ({
      id: car.id,
      carNumber: car.carNumber,
      manufacturer: car.carModel.manufacturer,
      model: car.carModel.model,
      type: car.carModel.type,
      manufacturingYear: car.manufacturingYear,
      mileage: car.mileage,
      price: car.price,
      accidentCount: car.accidentCount,
      explanation: car.explanation,
      accidentDetails: car.accidentDetails,
      status: car.status,
    }));
    const total = rawCars.total;
    const totalPages = Math.floor(total / Number(pageSize));
    const response = {
      currentPage: Number(page),
      totalPages: totalPages,
      totalItemCount: total,
      data: cars,
    };
    return res.status(200).json(response);
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

  updateCar = async (req: Request, res: Response) => {
    validator(req.params.carId, intIdSchema);
    validator(req.body, updateCarSchema);
    const carId = parseInt(req.params.carId, 10);
    if (!carId) {
      throw CustomError.badRequest();
    }
    const data: carUpdateDTO = req.body;
    if (!req.user) {
      throw CustomError.unauthorized();
    }
    const user = Number(req.user.userId);
    const rawCar = await carService.updateCar(data, carId, user);
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
    //params 검사
    validator(req.params.carId, intIdSchema);
    const carId = parseInt(req.params.carId, 10);
    if (!carId) {
      throw CustomError.badRequest();
    }
    //회사 조회 위한 유저 조회
    if (!req.user) {
      throw CustomError.unauthorized();
    }
    const user = Number(req.user.userId);
    //회사 id, 차량 id 일치하는 차량 삭제
    await carService.deleteCar(carId, user);
    return res.json(200).json({ message: '차량 삭제 성공' });
  };
}

export default new CarController();
