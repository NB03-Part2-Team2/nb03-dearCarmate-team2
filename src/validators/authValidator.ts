import { object, create } from 'superstruct';
import { LoginDTO } from '../types/userType';
import { utilValidator } from './utilValidator';

/**
 *
 * @param loginDTO email과 password를 입력받아 형식을 검증하는 validator 입니다.
 */
const loginValidator = (loginDTO: LoginDTO) => {
  const loginStruct = object({
    email: utilValidator.email,
    password: utilValidator.password,
  });
  create(loginDTO, loginStruct);
};

export { loginValidator };
