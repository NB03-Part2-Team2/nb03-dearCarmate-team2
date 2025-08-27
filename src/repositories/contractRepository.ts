import { Prisma, PrismaClient } from '../generated/prisma';
import prisma from '../libs/prisma';
import { meetingsDTO, carDTO } from '../types/contractType';
import { CustomError } from '../utils/customErrorUtil';

type TransactionClient = Omit<
  PrismaClient,
  '$connect' | '$disconnect' | '$on' | '$transaction' | '$use' | '$extends'
>;

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

  getCar = async (carId: number) => {
    const car = await prisma.car.findUnique({
      where: { id: carId },
      select: {
        id: true,
        price: true,
        status: true,
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

  createContract = async (
    userId: number,
    car: carDTO,
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

  getContractsByCompanyId = async (searchCondition: Prisma.ContractWhereInput) => {
    const contracts = await prisma.contract.findMany({
      where: searchCondition,
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
    return contracts;
  };

  getContractUserId = async (contractId: number, tx?: TransactionClient) => {
    const prismaClient = tx || prisma;
    const contract = await prismaClient.contract.findUnique({
      where: { id: contractId },
      select: {
        userId: true,
      },
    });
    return contract?.userId;
  };

  updateContract = async (
    contractId: number,
    data: Prisma.ContractUpdateInput,
    tx?: TransactionClient,
  ) => {
    const prismaClient = tx || prisma;
    return prismaClient.contract.update({
      where: { id: contractId },
      data: data,
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
  };

  deleteMeetingList = async (contractId: number, tx?: TransactionClient) => {
    const prismaClient = tx || prisma;
    return prismaClient.meetings.deleteMany({
      where: { contractId },
    });
  };

  createMeetingList = async (
    meetings: Prisma.MeetingsCreateManyInput[],
    tx?: TransactionClient,
  ) => {
    const prismaClient = tx || prisma;
    return prismaClient.meetings.createMany({
      data: meetings,
    });
  };

  deleteContractDocument = async (contractId: number, tx?: TransactionClient) => {
    const prismaClient = tx || prisma;
    return prismaClient.contractDocument.deleteMany({
      where: { contractId },
    });
  };

  createContractDocument = async (
    documentId: number,
    contractId: number,
    tx?: TransactionClient,
  ) => {
    const prismaClient = tx || prisma;
    return prismaClient.contractDocument.create({
      data: {
        document: { connect: { id: documentId } },
        contract: { connect: { id: contractId } },
      },
    });
  };

  deleteContract = async (contractId: number) => {
    return prisma.contract.delete({
      where: { id: contractId },
    });
  };
}

export default new ContractRepository();
