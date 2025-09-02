import { Request, Response, NextFunction } from 'express';

/**
 * 성능 측정 미들웨어
 * API 응답 시간을 측정하고 로그로 출력합니다.
 */
export const performanceLogger = (req: Request, res: Response, next: NextFunction) => {
  // 시작 시간 기록
  const startTime = Date.now();

  // 응답이 완료되면 실행되는 이벤트 리스너
  res.on('finish', () => {
    // 종료 시간 계산
    const endTime = Date.now();
    const responseTime = endTime - startTime;

    // 성능 정보 로그 출력
    console.log(`🚀 [Performance] ${req.method} ${req.originalUrl}`);
    console.log(`   ⏱️  응답 시간: ${responseTime}ms`);
    console.log(`   📊 상태 코드: ${res.statusCode}`);
    console.log(`   🕐 시간: ${new Date().toLocaleString('ko-KR')}`);
    console.log(`   ──────────────────────────────────────`);
  });

  // 다음 미들웨어로 진행
  next();
};
