import { object, assert, size, string, optional } from 'superstruct';
import { CreateUserRequestDTO, UpdateUserDTO } from '../types/userType';
import { utilValidator } from './utilValidator';
/**
 *
 * @param createUserRequestDTO createUserRequestDTO 입력받아 형식을 검증하는 validator 입니다.
 */
const createUserValidator = (createUserRequestDTO: CreateUserRequestDTO) => {
  const userStruct = object({
    name: utilValidator.name,
    email: utilValidator.email,
    password: utilValidator.password,
    passwordConfirmation: utilValidator.password,
    employeeNumber: utilValidator.employeeNumber,
    phoneNumber: utilValidator.phoneNumber,
    company: utilValidator.companyName,
    companyCode: size(string(), 1, 20), // 별도 제한이 없었던것 같기에 길이만 검사
  });
  assert(createUserRequestDTO, userStruct);
};

const updateUserValidator = (updateUserDTO: UpdateUserDTO) => {
  const userStruct = object({
    currentPassword: optional(utilValidator.password),
    password: optional(utilValidator.password),
    passwordConfirmation: optional(utilValidator.password),
    employeeNumber: optional(utilValidator.employeeNumber),
    phoneNumber: optional(utilValidator.phoneNumber),
    imageUrl: optional(string()),
    refreshToken: optional(string()),
  });
  assert(updateUserDTO, userStruct);
};

export { createUserValidator, updateUserValidator };
