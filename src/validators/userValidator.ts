import { object, create, size, string } from 'superstruct';
import { CreateUserRequestDTO } from '../types/userType';
import { utilValidator } from './utilValidator';

/**
 *
 * @param createUserRequestDTO createUserRequestDTO 입력받아 형식을 검증하는 validator 입니다.
 */
const createUserValidator = (createUserRequestDTO: CreateUserRequestDTO) => {
  const loginStruct = object({
    name: utilValidator.name,
    email: utilValidator.email,
    password: utilValidator.password,
    passwordConfirmation: utilValidator.password,
    employeeNumber: utilValidator.employeeNumber,
    phoneNumber: utilValidator.phoneNumber,
    company: utilValidator.companyName,
    companyCode: size(string(), 1, 20), // 별도 제한이 없었던것 같기에 길이만 검사
  });
  create(createUserRequestDTO, loginStruct);
};

export { createUserValidator };
