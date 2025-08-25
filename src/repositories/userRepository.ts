import prisma from '../libs/prisma';
import { CustomError } from '../utils/customErrorUtil';
import { UpdateUserDto, UserDTO } from '../types/userType';

class UserRepository {
  /**
   *
   * @param id userId 를 받습니다
   * @returns 해당하는 user가 있는 경우 해당 유저의 정보를 리턴, 없는 경우 error을 throw합니다.
   */
  getById = async (userId: number): Promise<UserDTO> => {
    const user: UserDTO | null = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        password: true,
        employeeNumber: true,
        phoneNumber: true,
        imageUrl: true,
        isAdmin: true,
        company: {
          select: {
            companyCode: true,
          },
        },
        refreshToken: true,
      },
    });
    if (!user) {
      throw CustomError.notFound('존재하지 않는 유저입니다.');
    }
    return user;
  };

  /**
   *
   * @param email email 를 받습니다
   * @returns 해당하는 user가 있는 경우 해당 유저의 정보를 리턴, 없는 경우 error을 throw합니다.
   */
  getByEmail = async (email: string): Promise<UserDTO> => {
    const user: UserDTO | null = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        name: true,
        email: true,
        password: true,
        employeeNumber: true,
        phoneNumber: true,
        imageUrl: true,
        isAdmin: true,
        company: {
          select: {
            companyCode: true,
          },
        },
        refreshToken: true,
      },
    });
    if (!user) {
      throw CustomError.notFound('존재하지 않는 유저입니다.');
    }
    return user;
  };

  update = async (data: UpdateUserDto, id: number): Promise<UserDTO> => {
    const updatedUser: UserDTO = await prisma.user.update({
      where: {
        id,
      },
      data: data,
      select: {
        id: true,
        name: true,
        email: true,
        password: true,
        employeeNumber: true,
        phoneNumber: true,
        imageUrl: true,
        isAdmin: true,
        company: {
          select: {
            companyCode: true,
          },
        },
        refreshToken: true,
      },
    });
    return updatedUser;
  };
}

export default new UserRepository();
