import { Request, Response } from 'express';
import userService from '../services/userService';
import authService from '../services/authService';
import { LoginDTO, UserDTO } from '../types/userType';
import { utilValidator } from '../validators/utilValidator';
import { object, create } from 'superstruct';
import { TokenDTO } from '../types/authType';

class AuthController {
  login = async (req: Request, res: Response) => {
    // 1. DTO 정의
    const loginDTO: LoginDTO = {
      email: req.body.email as string,
      password: req.body.password as string,
    };
    // 2. 유효성 검사
    const loginStruct = object({
      email: utilValidator.email,
      password: utilValidator.password,
    });
    create(loginDTO, loginStruct);

    // 3-1. DB에서 저장된 유저 조회 - 서비스 함수 호출
    const user = await userService.getUser(loginDTO);

    // 3-2. token 발행을 위한 유저 id 값 가공
    const tokenDTO: TokenDTO = {
      userId: user.id,
    };
    // 3-3. accessToken, refreshToken 발행 및 업데이트
    const accessToken = authService.createToken(tokenDTO);
    const refreshToken = authService.createToken(tokenDTO, 'refresh');
    const updatedUser: UserDTO = await userService.updateUser({ refreshToken }, user.id);

    // 4. 반환값을 가공하여 response를 돌려줍니다
    const filteredUser = userService.filterSensitiveUserData(updatedUser);
    return res.status(200).json({ user: filteredUser, accessToken, refreshToken });
  };

  updateToken = async (req: Request, res: Response) => {
    // 1. DTO 정의 - 개별적으로 사용하기에 생략
    const userRefreshToken: string = req.body.refreshToken as string;
    const userId: number = req.auth!.userId;
    // 2. 유효성 검사 - 이 미들웨어가 호출되기 전 verifyRefreshToken이 호출되므로 생략
    // 3. 서비스 함수 호출
    // 3-1. token 발행을 위한 유저 id 값 가공, verifyRefreshToken이 호출되므로 req.auth.userId가 존재함
    const tokenDTO: TokenDTO = {
      userId: req.auth!.userId,
    };
    // 3-2. refreshingAccessToken에서 현재 전달받은 토큰이 유효한지 검증
    const accessToken = await authService.refreshingAccessToken(userId, userRefreshToken);
    const refreshToken = authService.createToken(tokenDTO, 'refresh');
    // 3.3 새로 refreshToken을 발급받았으므로 DB도 업데이트
    await userService.updateUser({ refreshToken }, userId);
    // 4. 토큰 반환
    return res.status(200).json({ accessToken, refreshToken });
  };
}

export default new AuthController();
