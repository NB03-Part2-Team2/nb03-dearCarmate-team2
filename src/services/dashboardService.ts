import dashboardRepository from '../repositories/dashboardRepository';
import contractRepository from '../repositories/contractRepository';
import { DashboardDTO } from '../types/dashboardType';

class DashboardService {
  /**
   * 대시보드 데이터를 조회합니다.
   */
  getDashboardData = async (userId: number): Promise<DashboardDTO> => {
    // 사용자의 회사 ID 조회
    const companyId = await contractRepository.getCompanyId(userId);

    // 이번 달, 지난 달 범위 지정
    const now = new Date();
    const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const currentMonthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);
    const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59);

    // Repository에서 데이터 조회
    const [
      monthlySalesAgg,
      lastMonthSalesAgg,
      proceedingContractsCount,
      completedContractsCount,
      successfulContractList,
    ] = await Promise.all([
      dashboardRepository.getSalesSum(companyId, currentMonthStart, currentMonthEnd),
      dashboardRepository.getSalesSum(companyId, lastMonthStart, lastMonthEnd),
      dashboardRepository.getProceedingContractsCount(companyId),
      dashboardRepository.getCompletedContractsCount(companyId),
      dashboardRepository.getSuccessfulContractList(companyId),
    ]);
    // 데이터 변환 및 계산 (타입별 집계)
    const countMap: Record<string, number> = {};
    const salesMap: Record<string, number> = {};
    for (const contract of successfulContractList) {
      const type = contract.car.carModel.type || 'Unknown';
      countMap[type] = (countMap[type] || 0) + 1;
      salesMap[type] = (salesMap[type] || 0) + (contract.contractPrice || 0);
    }
    const contractsByCarType = Object.entries(countMap).map(([carType, count]) => ({
      carType,
      count,
    }));
    const salesByCarType = Object.entries(salesMap).map(([carType, count]) => ({
      carType,
      count,
    }));
    const monthlySales = monthlySalesAgg._sum.contractPrice || 0;
    const lastMonthSales = lastMonthSalesAgg._sum.contractPrice || 0;
    const growthRate = lastMonthSales === 0 ? 0 : (monthlySales - lastMonthSales) / lastMonthSales;

    return {
      monthlySales,
      lastMonthSales,
      growthRate,
      proceedingContractsCount,
      completedContractsCount,
      contractsByCarType,
      salesByCarType,
    };
  };
}

export default new DashboardService();
