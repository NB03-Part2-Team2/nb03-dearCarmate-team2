import { expressjwt } from 'express-jwt';
import { Request, Response, NextFunction } from 'express';
import userRepository from '../repositories/userRepository';
import { CustomError } from '../utils/customErrorUtil';
import userService from '../services/userService';

const secret = process.env.JWT_SECRET;
if (!secret) {
  throw new CustomError('JWT_SECRET is not defined in the environment variables.', 500);
}

/**
 * 액세스 토큰을 검증하는 미들웨어입니다.
 * authorization 헤더에 accessToken이 있는 경우 해당 토큰의 정보를
 * req.user의 속성으로 넣습니다.
 */
const verifyAccessToken = expressjwt({
  secret,
  algorithms: ['HS256'],
  requestProperty: 'user',
});

/**
 * 리프레시 토큰을 검증하는 미들웨어입니다.
 * API명세서에 request body에 refreshToken을 담아서 전달하도록 기재되어 있습니다.
 * 따라서 body에 refreshToken이 있는 경우 해당 토큰의 정보를
 * req.auth의 속성으로 넣습니다.
 */
const verifyRefreshToken = expressjwt({
  secret,
  algorithms: ['HS256'],
  getToken: (req) => req.body.refreshToken,
});

/**
 * expressjwt()에서 토큰이 없는 경우, UnauthorizedError에러를 발생
 * 에러 핸들러에서 처리 예정
 * 따라서 verifyAccessToken을 먼저 수행하고 에러가 없다면
 * 이미 로그인이 된 상태입니다.
 * 토큰은 유효하나 DB에는 제거해서 없을수도 있으므로 한번더 검사
 * */
const verifyUserAuth = async (req: Request, res: Response, next: NextFunction) => {
  const userId = req.user!.userId;
  // DB에 실제 있는 유저인지 확인
  await userService.checkUserExist({ id: userId });
  next();
};

/**
 * 어드민 권한 확인하는 곳이 많으므로 별도 미들웨어로 분리
 * verifyUserAuth는 호출되지 않아도 됩니다.
 * */
const verifyAdminAuth = async (req: Request, res: Response, next: NextFunction) => {
  const userId = req.user!.userId;
  const user = await userService.getUser({ id: userId });
  if (!user.isAdmin) {
    throw CustomError.unauthorized('관리자 권한이 필요합니다.');
  }
  next();
};

export default {
  verifyAccessToken,
  verifyRefreshToken,
  verifyUserAuth,
  verifyAdminAuth,
};
