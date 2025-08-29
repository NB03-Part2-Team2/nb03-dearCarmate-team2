import prisma from '../libs/prisma';
import { CreateUserDTO, UpdateUserDTO, UserDTO } from '../types/userType';

class UserRepository {
  create = async (createUserDTO: CreateUserDTO): Promise<UserDTO> => {
    return await prisma.user.create({
      data: createUserDTO,
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
  };
  /**
   *
   * @param id userId 를 받습니다
   * @returns 해당하는 user가 있는 경우 해당 유저의 정보를 리턴, 없는 경우 error을 throw합니다.
   */
  getById = async (userId: number): Promise<UserDTO | null> => {
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
    return user;
  };

  /**
   *
   * @param email email 를 받습니다
   * @returns 해당하는 user가 있는 경우 해당 유저의 정보를 리턴, 없는 경우 error을 throw합니다.
   */
  getByEmail = async (email: string): Promise<UserDTO | null> => {
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
    return user;
  };
  /**
   *
   * @param employeeNumber employeeNumber 를 받습니다
   * @returns 해당하는 user가 있는 경우 해당 유저의 정보를 리턴, 없는 경우 error을 throw합니다.
   */
  getByEmployeeNumber = async (employeeNumber: string): Promise<UserDTO | null> => {
    const user: UserDTO | null = await prisma.user.findUnique({
      where: { employeeNumber },
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
    return user;
  };

  update = async (updataUserDTO: UpdateUserDTO, id: number): Promise<UserDTO> => {
    const updatedUser: UserDTO = await prisma.user.update({
      where: {
        id,
      },
      // 비밀번호는 해싱해서 저장해야하므로 별도로 체크
      data: updataUserDTO,
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

  delete = async (userId: number): Promise<void> => {
    await prisma.user.delete({
      where: {
        id: userId,
      },
    });
  };

  getUserCountByCompanyId = async (companyId: number): Promise<number> => {
    const userCount = await prisma.user.count({
      where: { companyId },
    });
    return userCount;
  };
}

export default new UserRepository();
