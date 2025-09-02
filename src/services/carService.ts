import { Prisma } from '../generated/prisma';
import carRepository from '../repositories/carRepository';
import { carDTO, carListDTO } from '../types/carType';
import { CustomError } from '../utils/customErrorUtil';

class CarService {
  carByCarId = async (carId: number, userId: number) => {
    //1. 회사 확인
    const companyId = await carRepository.getCompanyByUserId(userId);
    //2. 회사 및 차량 아이디 검색
    const car = await carRepository.getCarByCarId(carId, companyId);
    if (!car) {
      throw CustomError.notFound('존재하지 않는 차량입니다.');
    }
    return car;
  };
  getCar = async (carId: number, userId: number) => {
    const car = await this.carByCarId(carId, userId);
    return car;
  };

  getCarList = async (
    { page, pageSize, status, searchBy, keyword }: carListDTO,
    userId: number,
  ) => {
    //1. 회사 확인
    const companyId = await carRepository.getCompanyByUserId(userId);
    //2. 검색 조건 설정
    let where: Prisma.CarWhereInput = { companyId: companyId };
    if (searchBy === 'carNumber') {
      where = {
        ...where,
        carNumber: {
          contains: keyword,
          mode: 'insensitive',
        },
      };
    } else if (searchBy === 'model') {
      where = {
        ...where,
        model: {
          contains: keyword,
          mode: 'insensitive',
        },
      };
    }

    if (status) {
      where = {
        ...where,
        status,
      };
    }
    //3. 회사 및 차량 목록 검색
    const cars = await carRepository.getCarList({ page, pageSize }, where);
    return cars;
  };

  createCar = async (data: carDTO, userId: number) => {
    //1. 회사 확인
    const companyId = await carRepository.getCompanyByUserId(userId);
    //2. 동일 차량 번호 여부 확인
    const carNum = await carRepository.getCarByCarNumber(data.carNumber, companyId);
    if (carNum) {
      throw CustomError.conflict();
    }
    //3. 차량 데이터 및 소속 회사 추가
    const createdCar = await carRepository.createCar(data, companyId);
    return createdCar;
  };

  updateCar = async (data: carDTO, carId: number, userId: number) => {
    //1. 회사 확인
    const companyId = await carRepository.getCompanyByUserId(userId);
    //2. 차량 존재 여부 확인
    const car = await carRepository.carExistance(carId, companyId);
    if (!car) {
      throw CustomError.notFound('존재하지 않는 차량입니다.');
    }
    //3. 차량 정보 수정
    const updatedCar = await carRepository.updateCar(data, carId);
    return updatedCar;
  };

  deleteCar = async (carId: number, userId: number) => {
    //1. 차량 스테이터스 확인
    const checkStatus = await this.carByCarId(carId, userId);
    if (checkStatus.status === 'contractCompleted' || checkStatus.status === 'contractProceeding') {
      throw CustomError.badRequest();
    }
    //2. 차량 삭제
    await carRepository.deleteCar(carId);
  };

  uploadCarList = async (
    data: Record<string, string | number | boolean | null>[],
    userId: number,
  ) => {
    const companyId = await carRepository.getCompanyByUserId(userId);
    const mappedCars: Prisma.CarCreateInput[] = data.map((car) => ({
      carNumber: car['carNumber'] as string,
      carModel: {
        connect: {
          model: car['model'] as string,
        },
      },
      manufacturingYear: Number(car['manufacturingYear']),
      mileage: Number(car['mileage']),
      price: Number(car['price']),
      accidentCount: Number(car['accidentCount']),
      explanation: car['explanation'] as string,
      accidentDetails: car['accidentDetails'] as string,
      company: {
        connect: {
          id: companyId,
        },
      },
      status: 'possession',
    }));
    await carRepository.uploadCarList(mappedCars);
  };

  getCarModelList = async () => {
    const carModelList = await carRepository.getCarModelList();
    return carModelList;
  };
}

export default new CarService();
