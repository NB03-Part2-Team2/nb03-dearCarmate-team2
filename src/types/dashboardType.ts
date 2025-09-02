export interface DashboardDTO {
  monthlySales: number;
  lastMonthSales: number;
  growthRate: number;
  proceedingContractsCount: number;
  completedContractsCount: number;
  contractsByCarType: {
    carType: string;
    count: number;
  }[];
  salesByCarType: {
    carType: string;
    count: number;
  }[];
}
