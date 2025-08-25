import prisma from '../libs/prisma';
import { meetingsDTO, carPriceDTO } from '../types/contractType';
import { CustomError } from '../utils/customErrorUtil';

class ContractRepository {
  getCompanyId = async (userId: number) => {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        company: {
          select: {
            id: true,
          },
        },
      },
    });
    if (!user || !user.company) {
      throw CustomError.badRequest();
    }
    return user.company.id;
  };

  getCarList = async (companyId: number) => {
    const cars = await prisma.car.findMany({
      where: {
        companyId,
        status: 'possession',
      },
      select: {
        id: true,
        carNumber: true,
        model: true,
      },
    });
    return cars;
  };

  getCarPrice = async (carId: number) => {
    const car = await prisma.car.findUnique({
      where: { id: carId },
      select: {
        id: true,
        price: true,
      },
    });
    return car;
  };

  getCustomerList = async (companyId: number) => {
    const customers = await prisma.customer.findMany({
      where: { companyId },
      select: {
        id: true,
        name: true,
        email: true,
      },
    });
    return customers;
  };

  getCustomer = async (customerId: number) => {
    const customer = await prisma.customer.findMany({
      where: { id: customerId },
      select: {
        id: true,
        name: true,
      },
    });
    return customer;
  };

  getUserList = async (companyId: number) => {
    const users = await prisma.user.findMany({
      where: { companyId },
      select: {
        id: true,
        name: true,
        email: true,
      },
    });
    return users;
  };

  getUser = async (userId: number) => {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
      },
    });
    return user;
  };

  createContract = async (
    userId: number,
    car: carPriceDTO,
    customerId: number,
    companyId: number,
    meetings: meetingsDTO[],
  ) => {
    const contract = await prisma.contract.create({
      data: {
        status: 'carInspection',
        contractPrice: car.price,
        car: {
          connect: {
            id: car.id,
          },
        },
        customer: {
          connect: {
            id: customerId,
          },
        },
        user: {
          connect: {
            id: userId,
          },
        },
        company: {
          connect: {
            id: companyId,
          },
        },
        meetings: {
          createMany: {
            data: meetings,
          },
        },
      },
      select: {
        id: true,
        status: true,
        resolutionDate: true,
        contractPrice: true,
        meetings: {
          select: {
            date: true,
            alarms: true,
          },
        },
        user: { select: { id: true, name: true } },
        customer: { select: { id: true, name: true } },
        car: { select: { id: true, model: true } },
      },
    });
    return contract;
  };
}

export default new ContractRepository();
