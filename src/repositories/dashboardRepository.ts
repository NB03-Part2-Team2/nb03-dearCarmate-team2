import prisma from '../libs/prisma';

class DashboardRepository {
  /**
   * 지정 기간동안 완료된 계약의 매출 합계를 조회합니다.
   */
  getSalesSum = async (companyId: number, startDate: Date, endDate: Date) => {
    return await prisma.contract.aggregate({
      where: {
        companyId,
        status: 'contractSuccessful',
        resolutionDate: {
          gte: startDate,
          lte: endDate,
        },
      },
      _sum: {
        contractPrice: true,
      },
    });
  };

  /**
   * 진행 중인 계약 수를 조회합니다.
   */
  getProceedingContractsCount = async (companyId: number) => {
    return await prisma.contract.count({
      where: {
        companyId,
        status: {
          in: ['carInspection', 'priceNegotiation', 'contractDraft'],
        },
      },
    });
  };

  /**
   * 완료된 계약 수를 조회합니다.
   */
  getCompletedContractsCount = async (companyId: number) => {
    return await prisma.contract.count({
      where: {
        companyId,
        status: 'contractSuccessful',
      },
    });
  };

  /**
   * 완료된 계약 목록을 조회합니다. (대시보드 생성에 필요한 정보만 포함)
   */
  getSuccessfulContractList = async (companyId: number) => {
    return await prisma.contract.findMany({
      where: { companyId, status: 'contractSuccessful' },
      select: {
        contractPrice: true,
        car: { select: { carModel: { select: { type: true } } } },
      },
    });
  };
}

export default new DashboardRepository();
