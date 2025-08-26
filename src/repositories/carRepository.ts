import prisma from '../libs/prisma';
import { carDTO } from '../types/carType';
import { CustomError } from '../utils/customErrorUtil';

class CarRepository {
  getCompanyCodeByUserId = async (userId: number) => {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        companyId: true,
      },
    });
    if (!user) {
      throw CustomError.badRequest();
    }
    const code = await prisma.company.findUnique({
      where: { id: user.companyId },
      select: {
        companyCode: true,
      },
    });
    if (!code) {
      throw CustomError.badRequest();
    }
    return code;
  };
  getCarId = async (carId: number) => {
    const car = await prisma.car.findUnique({
      where: { id: carId },
      select: {
        id: true,
        carNumber: true,
        carModel: true,
        manufacturingYear: true,
        mileage: true,
        price: true,
        accidentCount: true,
        explanation: true,
        accidentDetails: true,
        status: true,
      },
    });
    return car;
  };
  getCarByCarNumber = async (carNum: string) => {
    const carByNumber = await prisma.car.findUnique({
      where: {
        carNumber: carNum,
      },
      select: {
        id: true,
      },
    });
    return carByNumber;
  };
  createCar = async (data: carDTO, code: string) => {
    const car = await prisma.car.create({
      data: {
        carNumber: data.carNumber,
        carModel: { connect: { model: data.model } },
        manufacturingYear: data.manufacturingYear,
        mileage: data.mileage,
        price: data.price,
        accidentCount: data.accidentCount,
        explanation: data.explanation ?? null,
        accidentDetails: data.accidentDetails ?? null,
        company: { connect: { companyCode: code } }, //companyId가 CompanyWhereUniqueInput에 없어서 code로 연결
        status: 'possession',
      },
      select: {
        id: true,
        carNumber: true,
        manufacturingYear: true,
        mileage: true,
        price: true,
        accidentCount: true,
        explanation: true,
        accidentDetails: true,
        status: true,
        carModel: { select: { model: true, manufacturer: true, type: true } },
      },
    });
    return car;
  };
}

export default new CarRepository();
