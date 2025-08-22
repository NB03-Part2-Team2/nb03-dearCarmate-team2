import prisma from '../libs/prisma';

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
      throw new Error();
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
        model: true,
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
}

export default new ContractRepository();
