import contractRepository from '../repositories/contractRepository';
import { ListItemDTO } from '../types/contractType';

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
}

export default new ContractService();
