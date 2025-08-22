import bcrypt from 'bcryptjs';

class HashUtil {
  /**
   * 평문 문자열을 입력받아 해쉬된 문자열을 반환합니다
   */
  hashPassword = (password: string): String => {
    return bcrypt.hashSync(password, 10);
  };

  /**
   * @param password  사용자한테 받은 평문 비밀번호
   * @param hash DB에 저장된 해쉬된 비밀번호
   * @returns 입력받은 값이 저장할때 원본 값과 같으면 true, 일치하지 않으면 false 리턴
   */
  checkPassword = (password: string, hash: string): Boolean => {
    return bcrypt.compareSync(password, hash); // boolean
  };
}

export default new HashUtil();
