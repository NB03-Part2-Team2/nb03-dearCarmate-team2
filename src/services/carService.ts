import { Prisma } from '../generated/prisma';
import carRepository from '../repositories/carRepository';
import { carDTO, carListDTO } from '../types/carType';
import { CustomError } from '../utils/customErrorUtil';

class CarService {
  getCar = async (carId: number, userId: number) => {
    //1. 회사 확인
    const companyId = await carRepository.getCompanyByUserId(userId);
    //2. 회사 및 차량 아이디 검색
    const car = await carRepository.getCarByCarId(carId, companyId.company.id);
    if (!car) {
      throw CustomError.notFound();
    }
    return car;
  };

  getCarList = async (
    { page, pageSize, status, searchBy, keyword }: carListDTO,
    userId: number,
  ) => {
    //1. 회사 확인
    const companyId = await carRepository.getCompanyByUserId(userId);
    //2. 검색 조건 설정
    let where: Prisma.CarWhereInput = { companyId: companyId.company.id };
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
    //1. 동일 차량 번호 여부 확인
    const carNum = await carRepository.getCarByCarNumber(data.carNumber);
    if (carNum) {
      throw CustomError.conflict();
    }
    //2. 회사 확인
    const companyCode = await carRepository.getCompanyByUserId(userId);
    //3. 차량 데이터 및 소속 회사 추가
    const createdCar = await carRepository.createCar(data, companyCode.company.companyCode);
    return createdCar;
  };

  updateCar = async (data: carDTO, carId: number, userId: number) => {
    //1. 회사 확인
    const companyId = await carRepository.getCompanyByUserId(userId);
    //2. 차량 정보 수정
    const updatedCar = await carRepository.updateCar(data, carId, companyId.company.id);
    return updatedCar;
  };

  deleteCar = async (carId: number, userId: number) => {
    //1. 회사 확인
    const companyId = await carRepository.getCompanyByUserId(userId);
    //2. 차량 존재 여부 및 status 확인
    const checkStatus = await carRepository.getCarByCarId(carId, companyId.company.id);
    if (!checkStatus) {
      throw CustomError.notFound('존재하지 않는 차량입니다.');
    } else if (
      checkStatus.status === 'contractCompleted' ||
      checkStatus.status === 'contractProceeding'
    ) {
      throw CustomError.badRequest();
    }
    //3. 차량 삭제
    await carRepository.deleteCar(carId);
  };
}

export default new CarService();
