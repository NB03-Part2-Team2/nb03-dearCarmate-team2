import prisma from "../libs/prisma"

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
      return null;
    }
    return user.company.id;
  }

  getCars = async (companyId: number) => {
    const cars = await prisma.car.findMany({
      where: {
        companyId,
        status: 'posession'
      },
      select: {
        id: true,
        carNumber: true,
        model: true,
      },
    });
    return cars;
  }

  getCustomers = async (companyId: number) => {
    const customers = await prisma.customer.findMany({
      where: { companyId },
      select: {
        id: true,
        name: true,
        email: true,
      },
    });
    return customers;
  }

  getUsers = async (companyId: number) => {
    const users = await prisma.user.findMany({
      where: { companyId },
      select: {
        id: true,
        name: true,
        email: true,
      },
    });
    return users;
  }
}

export default new ContractRepository()