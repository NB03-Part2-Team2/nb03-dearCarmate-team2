import { CarStatus, Prisma, PrismaClient } from '../generated/prisma';
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

  getCar = async (carId: number, tx?: TransactionClient) => {
    const prismaClient = tx || prisma;
    const car = await prismaClient.car.findUnique({
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
    tx?: TransactionClient,
  ) => {
    const prismaClient = tx || prisma;
    const contract = await prismaClient.contract.create({
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

  getContractListByCompanyId = async (searchCondition: Prisma.ContractWhereInput) => {
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
    return await prismaClient.contract.update({
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

  getCarIdByContractId = async (contractId: number) => {
    const contract = await prisma.contract.findUnique({
      where: { id: contractId },
      select: { carId: true },
    });
    return contract?.carId;
  };

  updateCarStatus = async (carId: number, newStatus: string, tx?: TransactionClient) => {
    const prismaClient = tx || prisma;
    return await prismaClient.car.update({
      where: { id: carId },
      data: { status: newStatus as CarStatus },
    });
  };

  deleteMeetingList = async (contractId: number, tx?: TransactionClient) => {
    const prismaClient = tx || prisma;
    return await prismaClient.meetings.deleteMany({
      where: { contractId },
    });
  };

  createMeetingList = async (
    meetings: Prisma.MeetingsCreateManyInput[],
    tx?: TransactionClient,
  ) => {
    const prismaClient = tx || prisma;
    return await prismaClient.meetings.createMany({
      data: meetings,
    });
  };

  deleteContractDocumentRelation = async (contractId: number, tx?: TransactionClient) => {
    const prismaClient = tx || prisma;
    return await prismaClient.contractDocumentRelation.deleteMany({
      where: { contractId },
    });
  };

  createContractDocumentRelation = async (
    contractDocumentId: number,
    contractId: number,
    tx?: TransactionClient,
  ) => {
    const prismaClient = tx || prisma;
    return await prismaClient.contractDocumentRelation.create({
      data: {
        contractDocument: { connect: { id: contractDocumentId } },
        contract: { connect: { id: contractId } },
      },
    });
  };

  deleteContract = async (contractId: number, tx?: TransactionClient) => {
    const prismaClient = tx || prisma;
    return await prismaClient.contract.delete({
      where: { id: contractId },
    });
  };
}

export default new ContractRepository();
