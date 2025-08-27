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
    const contract = await contractRepository.createContract(
      userId,
      car,
      customerId,
      companyId,
      meetings,
    );
    return contract;
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
    const contracts = await contractRepository.getContractsByCompanyId(searchCondition);
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
    // 함수 전체를 트랜잭션 블록으로 감쌉니다.
    return await prisma.$transaction(async (tx) => {
      const { userId, customerId, carId, meetings, contractDocuments, ...restOfData } = updateData;
      // 인가 로직: tx를 전달합니다.
      const contractUserId = await contractRepository.getContractUserId(contractId, tx);
      if (logInUserId !== contractUserId) {
        throw CustomError.forbidden();
      }
      if (!customerId || !carId) {
        throw CustomError.badRequest();
      }
      // 미팅 업데이트 로직: 모든 레포지토리 함수에 tx를 전달합니다.
      if (meetings) {
        await contractRepository.deleteMeetingList(contractId, tx);
        const meetingsForCreate: Prisma.MeetingsCreateManyInput[] = meetings.map((m) => ({
          date: m.date,
          alarms: m.alarms,
          contractId,
        }));
        await contractRepository.createMeetingList(meetingsForCreate, tx);
      }
      // 문서 업데이트 로직: 모든 레포지토리 함수에 tx를 전달합니다.
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
      // 메인 계약 업데이트: 마지막 레포지토리 함수에도 tx를 전달합니다.
      const finalUpdateData: Prisma.ContractUpdateInput = {
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
      return updatedContract;
    });
  };

  deleteContract = async (contractId: number, logInUserId: number) => {
    const contractUserId = await contractRepository.getContractUserId(contractId);
    if (!contractUserId) {
      throw CustomError.notFound('존재하지 않는 계약입니다.');
    }
    if (logInUserId !== contractUserId) {
      throw CustomError.forbidden();
    }
    await contractRepository.deleteContract(contractId);
  };
}

export default new ContractService();
