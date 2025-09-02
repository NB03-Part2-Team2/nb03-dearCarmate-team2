import dashboardRepository from '../repositories/dashboardRepository';
import contractRepository from '../repositories/contractRepository';
import { DashboardDTO } from '../types/dashboardType';

class DashboardService {
  // 간단한 전환 플래그 (true: 캐싱, false: 실시간)
  private useCache = true;

  // 메모리 캐시 저장소
  private cache = new Map<number, { data: DashboardDTO; expiry: number }>();

  /**
   * 대시보드 데이터를 조회합니다.
   */
  getDashboardData = async (userId: number): Promise<DashboardDTO> => {
    if (this.useCache) {
      return this.getDashboardDataCached(userId);
    }
    return this.getDashboardDataRealtime(userId);
  };

  /**
   * 실시간 대시보드 데이터를 조회합니다. (기존 구현)
   */
  getDashboardDataRealtime = async (userId: number): Promise<DashboardDTO> => {
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
    const countMap = new Map<string, number>();
    const salesMap = new Map<string, number>();

    for (const contract of successfulContractList) {
      const type = contract.car.carModel.type || 'Unknown';
      countMap.set(type, (countMap.get(type) || 0) + 1);
      salesMap.set(type, (salesMap.get(type) || 0) + (contract.contractPrice || 0));
    }

    const contractsByCarType = Array.from(countMap.entries()).map(([carType, count]) => ({
      carType,
      count,
    }));
    const salesByCarType = Array.from(salesMap.entries()).map(([carType, count]) => ({
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

  /**
   * 캐싱된 대시보드 데이터를 조회합니다.
   */
  getDashboardDataCached = async (userId: number): Promise<DashboardDTO> => {
    const companyId = await contractRepository.getCompanyId(userId);

    // 캐시 확인
    const cached = this.cache.get(companyId);
    if (cached && Date.now() < cached.expiry) {
      return cached.data;
    }

    // 실시간 데이터 계산
    const data = await this.getDashboardDataRealtime(userId);

    // 캐시에 저장 (5분)
    this.cache.set(companyId, {
      data,
      expiry: Date.now() + 5 * 60 * 1000,
    });

    return data;
  };
}

export default new DashboardService();
