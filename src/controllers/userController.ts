import { Request, Response } from 'express';
import userService from '../services/userService';
import { createUserSchema, deleteUserSchema, updateUserSchema } from '../validators/userValidator';
import { validator } from '../validators/utilValidator';
import { CreateUserRequestDTO, DeleteUserDTO, GetUserDTO, UpdateUserDTO } from '../types/userType';

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
      companyName: req.body.company as string, // 명세서에는 company이나 실제로는 companyName을 받기에 수정
      companyCode: req.body.companyCode as string,
    };
    // 2. 유효성 검사
    validator(createUserRequestDTO, createUserSchema);
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

  updateUser = async (req: Request, res: Response) => {
    // 1. DTO 정의
    const id = req.user!.userId;
    const updateUserDTO: UpdateUserDTO = {
      employeeNumber: req.body.employeeNumber,
      phoneNumber: req.body.phoneNumber,
      currentPassword: req.body.currentPassword,
      password: req.body.password,
      passwordConfirmation: req.body.passwordConfirmation,
      imageUrl: req.body.imageUrl,
    };
    // 2. 유효성 검사 - id는 토큰 검증 미들웨어로 검증하므로 생략: 401 에러
    validator(updateUserDTO, updateUserSchema);
    // 3. service레이어 호출
    const user = await userService.updateUser(updateUserDTO, id);
    // 4. 유저 정보 반환
    return res.status(200).json(user);
  };

  deleteUser = async (req: Request, res: Response) => {
    // 1. DTO 정의
    const deleteUserDTO: DeleteUserDTO = {
      id: req.user!.userId,
    };
    // 2. 유효성 검사 - id는 토큰 검증 미들웨어로 검증하므로 생략: 401 에러
    // 3. service레이어 호출
    await userService.deleteUser(deleteUserDTO);
    // 4. 삭제 성공 메세지 반환
    return res.status(200).json({ message: '유저 삭제 성공' });
  };

  deleteUserByAdmin = async (req: Request, res: Response) => {
    // 1. DTO 정의
    const deleteUserDTO: DeleteUserDTO = {
      id: parseInt(req.params.userId),
    };
    // 2. 유효성 검사 - req.params로 받은 유저 값은 검증되지 않았으므로 체크
    validator({ id: req.params.userId }, deleteUserSchema);
    // 3. service레이어 호출
    await userService.deleteUser(deleteUserDTO);
    // 4. 삭제 성공 메세지 반환
    return res.status(200).json({ message: '유저 삭제 성공' });
  };
}

export default new UserController();
