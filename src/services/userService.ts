import companyRepository from '../repositories/companyRepository';
import userRepository from '../repositories/userRepository';
import { DeleteUserDTO, GetUserDTO, UpdateUserDTO, UserDTO } from '../types/userType';
import { CreateUserDTO, CreateUserRequestDTO } from '../types/userType';
import { CustomError } from '../utils/customErrorUtil';
import hashUtil from '../utils/hashUtil';

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
    // 2-3. 사원번호가 이미 존재하는지 검사 - 명세서에 없으나 사원번호는 고유하기에 추가
    if (await userRepository.getByEmployeeNumber(data.employeeNumber)) {
      throw CustomError.conflict('이미 존재하는 사원번호입니다.');
    }

    // 3. 회사 id 가져오기
    const companyId = await companyRepository.getIdByCode(companyCode);
    const createUserDTO: CreateUserDTO = {
      ...data,
      password: hashUtil.hashPassword(password),
      companyId,
    };

    // 4. prisma의 create 이용해 데이터 생성
    const user = await userRepository.create(createUserDTO);
    // 5. 민감정보 제외한 유저 데이터 반환
    return this.filterSensitiveUserData(user);
  };
  getUser = async (getUserDTO: GetUserDTO) => {
    const user = await userRepository.getById(getUserDTO.id);
    if (!user) {
      throw CustomError.notFound('존재하지 않는 유저입니다.');
    }
    return this.filterSensitiveUserData(user);
  };
  updateUser = async (updateUserDTO: UpdateUserDTO, id: number) => {
    // 1. 인증용 데이터를 추출합니다.
    const { currentPassword, passwordConfirmation, ...data } = updateUserDTO;
    // 2-1. 비밀번호와 비밀번호 확인이 같은지 확인합니다.
    if (passwordConfirmation !== data.password) {
      throw CustomError.badRequest('비밀번호와 비밀번호 확인이 일치하지 않습니다.');
    }
    // 2-2. 패스워드가 있으면 해싱 처리후 값을 변경합니다.
    if (data.password) {
      data.password = hashUtil.hashPassword(data.password);
    }
    // 3-1. 비밀번호 비교를 위해 유저 정보를 가져옵니다.
    const oldUser = await userRepository.getById(id);
    if (!oldUser) {
      throw CustomError.notFound('존재하지 않는 유저입니다.');
    }
    // 3-2. 현재 비밀번호가 저장된 값과 맞는지 비교합니다
    if (currentPassword && !hashUtil.checkPassword(currentPassword, oldUser.password)) {
      throw CustomError.badRequest('현재 비밀번호가 맞지 않습니다.');
    }
    // 3-3. 사원번호가 이미 존재하는지 검사 - 명세서에 없으나 사원번호는 고유하기에 추가
    if (data.employeeNumber && (await userRepository.getByEmployeeNumber(data.employeeNumber))) {
      throw CustomError.conflict('이미 존재하는 사원번호입니다.');
    }
    // 4. 전달받은 내용으로 user 정보를 업데이트 합니다.
    const updatedUser: UserDTO = await userRepository.update(data, id);
    return this.filterSensitiveUserData(updatedUser);
  };
  deleteUser = async (deleteUser: DeleteUserDTO) => {
    await userRepository.delete(deleteUser.id);
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
