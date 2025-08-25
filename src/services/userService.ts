import { UserDTO } from '../types/userType';

class UserService {
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
