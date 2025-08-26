import { Request, Response } from 'express';
import userService from '../services/userService';
import { createUserValidator } from '../validators/userValidator';
import { CreateUserRequestDTO, GetUserDTO } from '../types/userType';
import { CustomError } from '../utils/customErrorUtil';

class UserController {
  createUser = async (req: Request, res: Response) => {
    // 1. DTO 정의
    const createUserRequestDTO: CreateUserRequestDTO = {
      name: req.body.name as string,
      email: req.body.email as string,
      password: req.body.password as string,
      passwordConfirmation: req.body.passwordConfirmation as string,
      employeeNumber: req.body.employeeNumber as string,
      phoneNumber: req.body.phoneNumber as string,
      company: req.body.company as string,
      companyCode: req.body.companyCode as string,
    };
    // 2. 유효성 검사
    createUserValidator(createUserRequestDTO);
    // 3. service레이어 호출
    const user = await userService.createUser(createUserRequestDTO);
    // 4. 유저 정보 반환
    return res.status(201).json(user);
  };
  getUser = async (req: Request, res: Response) => {
    // 1. 유효성 검사 - 토큰 검증 미들웨어로 검증하므로 생략: 401 에러
    // 2. DTO 정의
    const getUserDTO: GetUserDTO = {
      id: req.user!.userId,
    };
    // 3. service레이어 호출
    const user = await userService.getUser(getUserDTO);
    // 4. 유저 정보 반환
    return res.status(200).json(user);
  };
}

export default new UserController();
