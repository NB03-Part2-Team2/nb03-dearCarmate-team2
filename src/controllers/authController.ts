import { Request, Response } from 'express';
import authService from '../services/authService';
import { loginValidator } from '../validators/authValidator';
import { LoginDTO } from '../types/userType';
import { TokenDTO, UpdateTokenDTO } from '../types/authType';

class AuthController {
  login = async (req: Request, res: Response) => {
    // 1. DTO 정의
    const loginDTO: LoginDTO = {
      email: req.body.email as string,
      password: req.body.password as string,
    };
    // 2. 유효성 검사
    loginValidator(loginDTO);
    // 3. service레이어 호출
    const loginUser = await authService.login(loginDTO);
    // 4. 로그인 유저 정보 반환
    return res.status(200).json(loginUser);
  };

  updateToken = async (req: Request, res: Response) => {
    // 1. DTO 정의
    const updateTokenDTO: UpdateTokenDTO = {
      userId: req.auth!.userId,
      requestRefreshToken: req.body.refreshToken as string,
    };
    // 2. 토큰 업데이트
    const updatedTokens = await authService.updateToken(updateTokenDTO);

    // 3. 토큰 반환
    return res.status(200).json(updatedTokens);
  };
}

export default new AuthController();
