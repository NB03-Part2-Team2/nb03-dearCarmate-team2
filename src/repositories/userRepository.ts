import prisma from '../libs/prisma';
import { User } from '../generated/prisma';

class UserRepository {
  getById = async (id: number): Promise<User> => {
    const user: User = await prisma.user.findUniqueOrThrow({
      where: { id },
    });

    return user;
  };
}

export default new UserRepository();
