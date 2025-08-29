import carRepository from '../repositories/carRepository';
import { carDTO, carListDTO } from '../types/carType';
import { CustomError } from '../utils/customErrorUtil';

class CarService {
  getCar = async (carId: number, userId: number) => {
    //1. 회사 확인
    const companyId = await carRepository.getCompanyByUserId(userId);
    //2. 회사 및 차량 아이디 검색
    const rawCar = await carRepository.getCarByCarId(carId, companyId.company.id);
    if (!rawCar) {
      throw CustomError.notFound();
    }
    //3. api 명세서에 맞게 배열 변경
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
    return car;
  };

  getCarList = async (
    { page, pageSize, status, searchBy, keyword }: carListDTO,
    userId: number,
  ) => {
    //1. 회사 확인
    const companyId = await carRepository.getCompanyByUserId(userId);
    //2. 회사 및 차량 목록 검색
    const cars = await carRepository.getCarList(
      { page, pageSize, status, searchBy, keyword },
      companyId.company.id,
    );
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
    const rawCar = await carRepository.createCar(data, companyCode.company.companyCode);
    //4. api 명세서에 맞게 배열 변경
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
    return createdCar;
  };

  updateCar = async (data: carDTO, carId: number, userId: number) => {
    //1. 회사 확인
    const companyId = await carRepository.getCompanyByUserId(userId);
    //2. 차량 정보 수정
    const rawCar = await carRepository.updateCar(data, carId, companyId.company.id);
    //3. api 명세서에 맞게 배열 변경
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
    return updatedCar;
  };

  deleteCar = async (carId: number, userId: number) => {
    //1. 회사 확인
    const companyId = await carRepository.getCompanyByUserId(userId);
    //2. 차량 status 확인
    const checkStatus = await carRepository.getCarByCarId(carId, companyId.company.id);
    if (checkStatus!.status === 'contractCompleted') {
      throw CustomError.badRequest();
    }
    //3. 차량 삭제
    await carRepository.deleteCar(carId);
  };
}

export default new CarService();
