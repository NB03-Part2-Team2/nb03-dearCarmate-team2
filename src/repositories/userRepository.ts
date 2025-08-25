import prisma from '../libs/prisma';
import { User } from '../generated/prisma';
import { CustomError } from '../utils/customErrorUtil';

class UserRepository {
  /**
   *
   * @param id userId 를 받습니다
   * @returns 해당하는 user가 있는 경우 해당 유저의 정보를 리턴, 없는 경우 error을 throw합니다.
   */
  getById = async (id: number): Promise<User> => {
    const user: User | null = await prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw CustomError.notFound('존재하지 않는 유저입니다.');
    }

    return user;
  };
}

export default new UserRepository();
