import carRepository from '../repositories/carRepository';
import { carDTO } from '../types/carType';
import { CustomError } from '../utils/customErrorUtil';

class CarService {
  getCar = async(carId: number)
  createCar = async (data: carDTO, userId: number) => {
    const carNum = await carRepository.getCarByCarNumber(data.carNumber);
    if (carNum) {
      throw CustomError.conflict();
    }
    const code = await carRepository.getCompanyCodeByUserId(userId);
    const createdCar = await carRepository.createCar(data, code.companyCode);
    return createdCar;
  };
}

export default new CarService();
