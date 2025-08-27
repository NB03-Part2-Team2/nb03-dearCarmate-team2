import { Prisma } from '../generated/prisma';
import prisma from '../libs/prisma';
import contractRepository from '../repositories/contractRepository';
import {
  FormattedContractsDTO,
  ListItemDTO,
  meetingsDTO,
  UpdateContractDTO,
} from '../types/contractType';
import { CustomError } from '../utils/customErrorUtil';

class ContractService {
  getCarsInCompany = async (userId: number) => {
    const companyId = await contractRepository.getCompanyId(userId);
    const cars = await contractRepository.getCarList(companyId);
    const formattedCars: ListItemDTO[] = cars.map((car) => ({
      id: car.id,
      data: `${car.model}(${car.carNumber})`,
    }));
    return formattedCars;
  };

  getCustomersInCompany = async (userId: number) => {
    const companyId = await contractRepository.getCompanyId(userId);
    const customers = await contractRepository.getCustomerList(companyId);
    const formattedCustomers: ListItemDTO[] = customers.map((customer) => ({
      id: customer.id,
      data: `${customer.name}(${customer.email})`,
    }));
    return formattedCustomers;
  };

  getUsersInCompany = async (userId: number) => {
    const companyId = await contractRepository.getCompanyId(userId);
    const users = await contractRepository.getUserList(companyId);
    const formattedUsers: ListItemDTO[] = users.map((user) => ({
      id: user.id,
      data: `${user.name}(${user.email})`,
    }));
    return formattedUsers;
  };

  createContract = async (
    userId: number,
    carId: number,
    customerId: number,
    meetings: meetingsDTO[],
  ) => {
    const companyId = await contractRepository.getCompanyId(userId);
    const car = await contractRepository.getCar(carId);
    if (!car || car.status !== 'possession') {
      throw CustomError.badRequest();
    }
    const result = await prisma.$transaction(async (tx) => {
      const contract = await contractRepository.createContract(
        userId,
        car,
        customerId,
        companyId,
        meetings,
        tx,
      );
      await contractRepository.updateCarStatus(carId, 'contractProceeding', tx);
      return contract;
    });
    return result;
  };

  getContractListInCompany = async (
    userId: number,
    searchBy: string | undefined,
    keyword: string | undefined,
  ) => {
    const validSearchBy = ['customerName', 'userName'];
    if (searchBy && !validSearchBy.includes(searchBy)) {
      throw CustomError.badRequest();
    }
    const companyId = await contractRepository.getCompanyId(userId);
    let searchCondition: Prisma.ContractWhereInput = {
      companyId: companyId,
    };
    if (searchBy && keyword) {
      if (searchBy === 'customerName') {
        searchCondition.customer = {
          name: {
            contains: keyword,
            mode: 'insensitive',
          },
        };
      } else if (searchBy === 'userName') {
        searchCondition.user = {
          name: {
            contains: keyword,
            mode: 'insensitive',
          },
        };
      }
    }
    const contracts = await contractRepository.getContractListByCompanyId(searchCondition);
    const formattedContracts: FormattedContractsDTO = contracts.reduce((accumulator, contract) => {
      const status: string = contract.status;
      if (!accumulator[status]) {
        accumulator[status] = {
          totalItemCount: 0,
          data: [],
        };
      }
      accumulator[status].data.push(contract);
      accumulator[status].totalItemCount++;
      return accumulator;
    }, {} as FormattedContractsDTO);
    return formattedContracts;
  };

  updateContract = async (
    contractId: number,
    updateData: UpdateContractDTO,
    logInUserId: number,
  ) => {
    const { userId, customerId, carId, meetings, contractDocuments, ...restOfData } = updateData;
    const contractUserId = await contractRepository.getContractUserId(contractId);
    if (logInUserId !== contractUserId) {
      throw CustomError.forbidden();
    }
    if (!customerId || !carId) {
      throw CustomError.badRequest();
    }
    // 업데이트 상태에 따른 자동차 상태를 매핑하는 객체
    const statusMapping = {
      contractSuccessful: 'contractCompleted',
      contractFailed: 'possession',
      carInspection: 'contractProceeding',
      priceNegotiation: 'contractProceeding',
      contractDraft: 'contractProceeding',
    };
    const result = await prisma.$transaction(async (tx) => {
      // 미팅 업데이트 로직
      if (meetings) {
        await contractRepository.deleteMeetingList(contractId, tx);
        const meetingsForCreate = meetings.map((m) => ({
          date: m.date,
          alarms: m.alarms,
          contractId,
        }));
        await contractRepository.createMeetingList(meetingsForCreate, tx);
      }
      // 문서 업데이트 로직
      if (contractDocuments) {
        await contractRepository.deleteContractDocument(contractId, tx);
        const createPromises = contractDocuments
          .map((doc) => {
            if (doc.id) {
              return contractRepository.createContractDocument(doc.id, contractId, tx);
            }
            return null;
          })
          .filter(Boolean);
        await Promise.all(createPromises);
      }
      // 메인 계약 업데이트
      const finalUpdateData = {
        ...restOfData,
        ...(userId && { user: { connect: { id: userId } } }),
        ...(customerId && { customer: { connect: { id: customerId } } }),
        ...(carId && { car: { connect: { id: carId } } }),
      };
      const updatedContract = await contractRepository.updateContract(
        contractId,
        finalUpdateData,
        tx,
      );
      if (updateData.status && statusMapping[updateData.status]) {
        const newCarStatus = statusMapping[updateData.status];
        await contractRepository.updateCarStatus(carId, newCarStatus, tx);
      }
      return updatedContract;
    });
    return result;
  };

  deleteContract = async (contractId: number, logInUserId: number) => {
    const contractUserId = await contractRepository.getContractUserId(contractId);
    if (!contractUserId) {
      throw CustomError.notFound('존재하지 않는 계약입니다.');
    }
    if (logInUserId !== contractUserId) {
      throw CustomError.forbidden();
    }
    const carId = await contractRepository.getCarIdByContractId(contractId);
    if (!carId) {
      throw CustomError.notFound('존재하지 않는 차량입니다.');
    }
    await prisma.$transaction(async (tx) => {
      await contractRepository.deleteContract(contractId, tx);
      await contractRepository.updateCarStatus(carId, 'possession', tx);
    });
  };
}

export default new ContractService();
