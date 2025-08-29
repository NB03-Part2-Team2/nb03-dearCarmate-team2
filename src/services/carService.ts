import carRepository from '../repositories/carRepository';
import { carDTO, carListDTO } from '../types/carType';
import { CustomError } from '../utils/customErrorUtil';

class CarService {
  getCar = async (carId: number) => {
    const car = await carRepository.getCarByCarId(carId);
    if (!car) {
      throw CustomError.notFound();
    }
    return car;
  };

  getCarList = async (
    { page, pageSize, status, searchBy, keyword }: carListDTO,
    userId: number,
  ) => {
    const companyId = await carRepository.getCompanyByUserId(userId);
    const cars = await carRepository.getCarList(
      { page, pageSize, status, searchBy, keyword },
      companyId.company.id,
    );
    return cars;
  };

  createCar = async (data: carDTO, userId: number) => {
    //동일 차량 번호 여부 확인
    const carNum = await carRepository.getCarByCarNumber(data.carNumber);
    if (carNum) {
      throw CustomError.conflict();
    }
    const companyCode = await carRepository.getCompanyByUserId(userId);
    const createdCar = await carRepository.createCar(data, companyCode.company.companyCode);
    return createdCar;
  };
}

export default new CarService();
