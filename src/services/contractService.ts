import contractRepository from '../repositories/contractRepository';
import { ListItemDTO, meetingsDTO } from '../types/contractType';

class ContractService {
  getCarsInCompany = async (userId: number) => {
    const companyId = await contractRepository.getCompanyId(userId);
    if (!companyId) {
      throw new Error();
    }
    const cars = await contractRepository.getCarList(companyId);
    const formattedCars: ListItemDTO[] = cars.map((car) => ({
      id: car.id,
      data: `${car.model}(${car.carNumber})`,
    }));
    return formattedCars;
  };

  getCustomersInCompany = async (userId: number) => {
    const companyId = await contractRepository.getCompanyId(userId);
    if (!companyId) {
      throw new Error();
    }
    const customers = await contractRepository.getCustomerList(companyId);
    const formattedCustomers: ListItemDTO[] = customers.map((customer) => ({
      id: customer.id,
      data: `${customer.name}(${customer.email})`,
    }));
    return formattedCustomers;
  };

  getUsersInCompany = async (userId: number) => {
    const companyId = await contractRepository.getCompanyId(userId);
    if (!companyId) {
      throw new Error();
    }
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
    if (!companyId) {
      throw new Error();
    }
    const car = await contractRepository.getCarPrice(carId);
    if (!car) {
      throw new Error();
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
}

export default new ContractService();
