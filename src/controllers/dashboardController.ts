import { Request, Response } from 'express';
import dashboardService from '../services/dashboardService';

class DashboardController {
  /**
   * 대시보드 데이터를 조회합니다.
   */
  getDashboardData = async (req: Request, res: Response) => {
    // 1. 사용자 ID 추출
    const userId = req.user!.userId;

    // 2. service 레이어 호출
    const dashboardData = await dashboardService.getDashboardData(userId);

    // 3. 결과 반환
    return res.status(200).json(dashboardData);
  };
}

export default new DashboardController();
