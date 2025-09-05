import companyRepository from '../repositories/companyRepository';
import userRepository from '../repositories/userRepository';
import { DeleteUserDTO, GetUserDTO, UpdateUserDTO, UserDTO } from '../types/userType';
import { CreateUserDTO, CreateUserRequestDTO } from '../types/userType';
import { CustomError } from '../utils/customErrorUtil';
import hashUtil from '../utils/hashUtil';

class UserService {
  /**
   * 새로운 사용자를 생성합니다.
   * @param {CreateUserRequestDTO} createUserRequestDTO - 사용자 생성에 필요한 정보
   * @returns 생성된 사용자 정보 (민감 정보 제외)
   */
  createUser = async (createUserRequestDTO: CreateUserRequestDTO) => {
    // 1. 정보 분리
    const { password, passwordConfirmation, companyName, companyCode, ...data } =
      createUserRequestDTO;
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
    // 2-4. 회사 정보 가져오기
    const company = await companyRepository.getByCode(companyCode);
    // 2-5. 기업명과 기업 코드가 일치하는지 확인
    if (company.companyName !== companyName) {
      throw CustomError.badRequest('기업코드가 올바르지 않습니다.');
    }

    // 3. 유저 생성용 DTO 만들기
    const createUserDTO: CreateUserDTO = {
      ...data,
      password: hashUtil.hashPassword(password),
      companyId: company.id,
    };

    // 4. prisma의 create 이용해 데이터 생성
    const user = await userRepository.create(createUserDTO);
    // 5. 민감정보 제외한 유저 데이터 반환
    return this.filterSensitiveUserData(user);
  };

  /**
   * 특정 사용자 정보를 조회합니다.
   * @param {GetUserDTO} getUserDTO - 조회할 사용자 ID
   * @returns 사용자 정보 (민감 정보 제외)
   */
  getUser = async (getUserDTO: GetUserDTO) => {
    const user = await userRepository.getById(getUserDTO.id);
    if (!user) {
      throw CustomError.notFound('존재하지 않는 유저입니다.');
    }
    return this.filterSensitiveUserData(user);
  };

  /**
   * 사용자 정보를 업데이트합니다.
   * @param {UpdateUserDTO} updateUserDTO - 업데이트할 사용자 정보
   * @param {number} id - 사용자 ID
   * @returns 업데이트된 사용자 정보 (민감 정보 제외)
   */
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
    // 3-3. 현재 입력받은 사원번호가 자신의 사원번호일 경우 수정하지 않도록 변경
    if (oldUser.employeeNumber === data.employeeNumber) {
      delete data.employeeNumber;
    }
    // 3-4. 사원번호가 이미 존재하는지 검사 - 명세서에 없으나 사원번호는 고유하기에 추가
    if (data.employeeNumber && (await userRepository.getByEmployeeNumber(data.employeeNumber))) {
      throw CustomError.conflict('이미 존재하는 사원번호입니다.');
    }
    // 4. 전달받은 내용으로 user 정보를 업데이트 합니다.
    const updatedUser: UserDTO = await userRepository.update(data, id);
    return this.filterSensitiveUserData(updatedUser);
  };

  /**
   * 특정 사용자를 삭제합니다.
   * @param {DeleteUserDTO} deleteUser - 삭제할 사용자 ID
   * @returns 없음
   */
  deleteUser = async (deleteUser: DeleteUserDTO) => {
    await userRepository.delete(deleteUser.id);
  };

  /**
   * 사용자 객체에서 민감한 정보(비밀번호, 리프레시 토큰)를 제거합니다.
   * @param {UserDTO} user - 사용자 정보 객체
   * @returns 민감 정보가 제거된 사용자 정보
   */
  filterSensitiveUserData = (user: UserDTO) => {
    const { password, refreshToken, ...rest } = user;
    return rest;
  };

  /**
   * 사용자가 존재하는지 확인합니다.
   * @param {GetUserDTO} getUserDTO - 확인할 사용자 ID
   * @returns 없음 (사용자가 없으면 에러 발생)
   */
  checkUserExist = async (getUserDTO: GetUserDTO) => {
    const isUserExist = await userRepository.checkAuthById(getUserDTO.id);
    if (!isUserExist) {
      throw CustomError.notFound('존재하지 않는 유저입니다.');
    }
  };

  /**
   * 사용자가 관리자인지 확인합니다.
   * @param {GetUserDTO} getUserDTO - 확인할 사용자 ID
   * @returns 없음 (관리자가 아니거나 사용자가 없으면 에러 발생)
   */
  checkUserAdmin = async (getUserDTO: GetUserDTO) => {
    const isUserAdmin = await userRepository.checkAuthById(getUserDTO.id);
    // 유저가 있는지 확인
    if (!isUserAdmin) {
      throw CustomError.notFound('존재하지 않는 유저입니다.');
    }
    // 어드민 권한을 가지고 있는지 확인
    if (!isUserAdmin.isAdmin) {
      throw CustomError.unauthorized('관리자 권한이 필요합니다.');
    }
  };
}

export default new UserService();
