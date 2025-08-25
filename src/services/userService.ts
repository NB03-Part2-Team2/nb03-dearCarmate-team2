import { LoginDTO, UpdateUserDto, UserDTO } from '../types/userType';
import userRepository from '../repositories/userRepository';
import hashUtil from '../utils/hashUtil';
import { CustomError } from '../utils/customErrorUtil';

class UserService {
  getUser = async (loginDTO: LoginDTO): Promise<UserDTO> => {
    // 1. 이메일로 유저를 조회합니다.
    const user: UserDTO = await userRepository.getByEmail(loginDTO.email);
    // 2. 조회한 유저의 비밀번호화 입력받은 비밀번호를 검증합니다.
    if (!hashUtil.checkPassword(loginDTO.password, user.password!)) {
      throw CustomError.notFound('존재하지 않거나 비밀번호가 일치하지 않습니다');
    }
    return user;
  };

  updateUser = async (updateUserDto: UpdateUserDto, id: number): Promise<UserDTO> => {
    // 1. 전달받은 내용으로 user 정보를 업데이트 합니다.
    const updatedUser: UserDTO = await userRepository.update(updateUserDto, id);
    return updatedUser;
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
