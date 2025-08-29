import { Prisma } from '../generated/prisma';
import prisma from '../libs/prisma';
import { carDTO, carListDTO } from '../types/carType';
import { CustomError } from '../utils/customErrorUtil';

class CarRepository {
  getCompanyByUserId = async (userId: number) => {
    const company = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        company: { select: { id: true, companyCode: true } },
      },
    });
    if (!company) {
      throw CustomError.badRequest();
    }
    return company;
  };

  getCarByCarId = async (carId: number) => {
    const car = await prisma.car.findUnique({
      where: { id: carId },
      select: {
        id: true,
        carNumber: true,
        carModel: {
          select: {
            model: true,
            manufacturer: true,
            type: true,
          },
        },
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

  getCarList = async (
    { page, pageSize, status, searchBy, keyword }: carListDTO,
    companyId: number,
  ) => {
    const skip = (page - 1) * pageSize;
    const take = pageSize;

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

    const [carsData, total] = await Promise.all([
      prisma.car.findMany({
        where,
        skip,
        take,
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
          carModel: {
            select: {
              model: true,
              manufacturer: true,
              type: true,
            },
          },
        },
      }),
      prisma.car.count({
        where,
      }),
    ]);

    return {
      data: carsData,
      total,
    };
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
        company: { connect: { companyCode: code } },
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

  updateCar = async (data: carDTO, carId: number) => {
    const updatedCar = prisma.car.update({
      data: {
        carNumber: data.carNumber,
        carModel: { connect: { model: data.model } },
        manufacturingYear: data.manufacturingYear,
        mileage: data.mileage,
        price: data.price,
        accidentCount: data.accidentCount,
        explanation: data.explanation,
        accidentDetails: data.accidentDetails,
      },
      where: { id: carId },
      select: {
        id: true,
        carNumber: true,
        carModel: { select: { model: true, manufacturer: true, type: true } },
        manufacturingYear: true,
        mileage: true,
        price: true,
        accidentCount: true,
        explanation: true,
        accidentDetails: true,
        status: true,
      },
    });
    return updatedCar;
  };

  deleteCar = async (carId: number) => {
    await prisma.car.delete({
      where: { id: carId },
    });
  };
}

export default new CarRepository();
