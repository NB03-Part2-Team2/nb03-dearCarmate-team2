import contractRepository from '../repositories/contractRepository';
import { formattedContractsDTO, ListItemDTO, meetingsDTO } from '../types/contractType';
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
    const car = await contractRepository.getCarPrice(carId);
    if (!car) {
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

  getContractsInCompany = async (
    userId: number,
    searchBy: string | undefined,
    keyword: string | undefined,
  ) => {
    const companyId = await contractRepository.getCompanyId(userId);
    const contracts = await contractRepository.getContractsByCompanyId(
      companyId,
      searchBy,
      keyword,
    );
    const formattedContracts: formattedContractsDTO = contracts.reduce((accumulator, contract) => {
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
    }, {} as formattedContractsDTO);
    return formattedContracts;
  };
}

export default new ContractService();
