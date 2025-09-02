import { Prisma } from '../generated/prisma';
import prisma from '../libs/prisma';
import { carDTO, carListDTO } from '../types/carType';
import { CustomError } from '../utils/customErrorUtil';

class CarRepository {
  getCompanyByUserId = async (userId: number) => {
    const company = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        company: { select: { id: true } },
      },
    });
    if (!company) {
      throw CustomError.badRequest();
    }
    return company.company.id;
  };

  getCarByCarId = async (carId: number, companyId: number) => {
    const car = await prisma.car.findUnique({
      where: { id: carId, companyId: companyId },
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

  getCarList = async ({ page, pageSize }: carListDTO, where: Prisma.CarWhereInput) => {
    const skip = (page - 1) * pageSize;
    const take = pageSize;

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

  createCar = async (data: carDTO, companyId: number) => {
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
        company: { connect: { id: companyId } },
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

  updateCar = async (data: carDTO, carId: number, companyId: number) => {
    const updatedCar = await prisma.car.update({
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
      where: { id: carId, companyId: companyId },
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

  uploadCarList = async (cars: Prisma.CarCreateInput[]) => {
    const uploadedCars = await prisma.$transaction(async (tx) => {
      for (const car of cars) await tx.car.create({ data: car });
    });
    return uploadedCars;
  };

  getCarModelList = async () => {
    const [carModelList, total] = await Promise.all([
      prisma.carModel.findMany({
        select: {
          manufacturer: true,
          model: true,
        },
      }),
      prisma.carModel.count(),
    ]);
    return { data: carModelList, total };
  };
}

export default new CarRepository();
