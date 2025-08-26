import { Request, Response } from 'express';
import userService from '../services/userService';
import { createUserValidator } from '../validators/userValidator';
import { CreateUserRequestDTO } from '../types/userType';

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
}

export default new UserController();
