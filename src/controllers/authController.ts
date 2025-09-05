import { Request, Response } from 'express';
import authService from '../services/authService';
import { loginValidator } from '../validators/authValidator';
import { LoginDTO } from '../types/userType';
import { UpdateTokenDTO } from '../types/authType';

class AuthController {
  /**
   * 사용자 로그인을 처리합니다.
   * @param {string} req.body.email - 이메일
   * @param {string} req.body.password - 비밀번호
   * @returns 로그인한 사용자 정보를 담은 JSON 응답
   */
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

  /**
   * 만료된 액세스 토큰을 갱신합니다.
   * @param {string} req.body.refreshToken - 리프레시 토큰
   * @returns 새로 발급된 액세스 및 리프레시 토큰을 담은 JSON 응답
   */
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
