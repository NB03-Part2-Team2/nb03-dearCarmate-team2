import { Prisma } from '../generated/prisma';
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

  getUserList = async (page: number, pageSize: number, where: Prisma.UserWhereInput) => {
    const skip = (page - 1) * pageSize;
    const take = pageSize;

    const [data, totalItemCount] = await Promise.all([
      // 페이지네이션 된 유저 정보
      prisma.user.findMany({
        where,
        skip,
        take,
        select: {
          id: true,
          name: true,
          email: true,
          employeeNumber: true,
          phoneNumber: true,
          company: {
            select: { companyName: true },
          },
        },
      }),
      // 페이지에 포함되지 않는 전체 아이템 수까지 가져오기
      prisma.user.count({
        where,
      }),
    ]);

    // 페이지네이션 된 유저 정보들과 조건에 맞는 데이터 개수 전체 반환
    return {
      data,
      totalItemCount,
    };
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

  checkExistById = async (userId: number): Promise<boolean> => {
    // 유저 존재 여부만 확인하기 위한 최소데이터 조회
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
      },
    });
    // 유저가 없으면 false, 있으면 true 반환
    if (!user) {
      return false;
    }
    return true;
  };
}

export default new UserRepository();
