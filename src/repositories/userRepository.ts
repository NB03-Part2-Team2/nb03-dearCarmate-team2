import { Prisma } from '../generated/prisma';
import prisma from '../libs/prisma';
import { CreateUserDTO, UpdateUserDTO, UserDTO } from '../types/userType';

class UserRepository {
  /**
   * 새로운 사용자를 생성합니다.
   * @param {CreateUserDTO} createUserDTO - 사용자 생성에 필요한 정보
   * @returns 생성된 사용자 정보
   */
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
   * ID를 기준으로 사용자를 조회합니다.
   * @param {number} userId - 사용자 ID
   * @returns 사용자 정보 또는 null
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
   * 이메일을 기준으로 사용자를 조회합니다.
   * @param {string} email - 사용자 이메일
   * @returns 사용자 정보 또는 null
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
   * 사원번호를 기준으로 사용자를 조회합니다.
   * @param {string} employeeNumber - 사원번호
   * @returns 사용자 정보 또는 null
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

  /**
   * 사용자 목록을 페이지네이션하여 가져옵니다.
   * @param {number} page - 페이지 번호
   * @param {number} pageSize - 페이지 당 항목 수
   * @param {Prisma.UserWhereInput} where - Prisma를 이용한 검색 조건
   * @returns 사용자 목록 및 전체 항목 수
   */
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

  /**
   * 사용자 정보를 업데이트합니다.
   * @param {UpdateUserDTO} updataUserDTO - 업데이트할 사용자 정보
   * @param {number} id - 사용자 ID
   * @returns 업데이트된 사용자 정보
   */
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

  /**
   * 특정 사용자를 삭제합니다.
   * @param {number} userId - 삭제할 사용자 ID
   * @returns 없음
   */
  delete = async (userId: number): Promise<void> => {
    await prisma.user.delete({
      where: {
        id: userId,
      },
    });
  };

  /**
   * ID를 기준으로 사용자의 존재와 관리자 권한을 확인합니다.
   * @param {number} userId - 사용자 ID
   * @returns 사용자 ID 및 관리자 여부 반환, 존재하지 않을 경우 null
   */
  checkAuthById = async (userId: number) => {
    // 유저 권한 여부만 확인하기 위한 최소데이터 조회
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        isAdmin: true,
      },
    });
    return user;
  };
}

export default new UserRepository();
