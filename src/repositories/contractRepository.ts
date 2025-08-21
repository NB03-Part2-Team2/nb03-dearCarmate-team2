import prisma from "../libs/prisma"

class ContractRepository {
  getCompanyId = async (userId) => {
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
  };

  getCars = async (companyId) => {
    const cars = await prisma.car.findMany({
      where: { companyId },
    });
    return cars;
  };
}

export default new ContractRepository()