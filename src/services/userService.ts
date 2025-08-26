import companyRepository from '../repositories/companyRepository';
import userRepository from '../repositories/userRepository';
import { UserDTO } from '../types/userType';
import { CreateUserDTO, CreateUserRequestDTO } from '../types/userType';
import { CustomError } from '../utils/customErrorUtil';

class UserService {
  createUser = async (createUserRequestDTO: CreateUserRequestDTO) => {
    // 1. 정보 분리
    const { password, passwordConfirmation, company, companyCode, ...data } = createUserRequestDTO;
    // 2-1. 패스워드 확인
    if (password !== passwordConfirmation) {
      throw CustomError.badRequest('비밀번호와 비밀번호 확인이 일치하지 않습니다');
    }
    // 2-2. 이미 존재하는 이메일인지 확인
    if (await userRepository.getByEmail(data.email)) {
      throw CustomError.conflict('이미 존재하는 이메일입니다');
    }
    // 3. 회사 id 가져오기
    const companyId = await companyRepository.getIdByCode(companyCode);
    const createUserDTO: CreateUserDTO = {
      ...data,
      password,
      companyId,
    };

    // 4. prisma의 create 이용해 데이터 생성
    const user = await userRepository.create(createUserDTO);
    // 5. 민감정보 제외한 유저 데이터 반환
    return this.filterSensitiveUserData(user);
  };
  /**
   *
   * @param user 민감정보가 포함된 유저 객체입니다.
   * @returns password, refreshToken과 같은 민감 정보가 제거된 유저 객체를 반환합니다.
   */
  filterSensitiveUserData = (user: UserDTO) => {
    const { password, refreshToken, ...rest } = user;
    return rest;
  };
}

export default new UserService();
