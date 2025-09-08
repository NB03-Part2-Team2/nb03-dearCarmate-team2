import { StructError } from 'superstruct';
import { CustomError } from '../utils/customErrorUtil';
import type { ErrorRequestHandler } from 'express';

export const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  // 커스텀 HTTP 에러 (CustomError로 생성된 에러)
  if (err instanceof CustomError) {
    return res.status(err.code).json({ message: err.message });
  }

  // Superstruct 검증 에러
  if (err instanceof StructError) {
    return res.status(400).json({ message: '잘못된 요청입니다.' });
  }

  // JSON 파싱 에러
  if (err instanceof SyntaxError) {
    return res.status(400).json({ message: '잘못된 JSON 형식입니다.' });
  }

  // Prisma 에러들 (타입 안전한 방식으로 체크)
  if (err && typeof err === 'object' && 'name' in err) {
    // Prisma 검증 에러
    if (err.name === 'PrismaClientValidationError') {
      return res.status(400).json({ message: (err as any).message });
    }

    // Prisma Unique 제약 조건 에러
    if (err.name === 'PrismaClientKnownRequestError' && (err as any).code === 'P2002') {
      return res.status(409).json({ message: '이미 존재하는 데이터입니다.' });
    }

    // Prisma 레코드 없음 에러
    if (err.name === 'PrismaClientKnownRequestError' && (err as any).code === 'P2025') {
      return res.status(404).json({ message: '요청한 리소스를 찾을 수 없습니다.' });
    }

    // 기타 Prisma 에러
    if (err.name === 'PrismaClientKnownRequestError') {
      return res.status(400).json({ message: (err as any).message });
    }
  }

  // JWT 인증 에러
  if (err instanceof Error && err.name === 'UnauthorizedError') {
    return res.status(401).json({ message: '로그인이 필요합니다.' });
  }

  // JWT 토큰 만료 에러
  if (err instanceof Error && err.name === 'TokenExpiredError') {
    return res.status(401).json({ message: '토큰이 만료되었습니다.' });
  }

  // JWT 토큰 형식 에러
  if (err instanceof Error && err.name === 'JsonWebTokenError') {
    return res.status(401).json({ message: '유효하지 않은 토큰입니다.' });
  }

  // 기본 서버 에러
  return res.status(500).json({ message: '서버 내부 오류가 발생했습니다.' });
};
