import prisma from '../libs/prisma';
import { Prisma } from '../generated/prisma';
import { CreateCompanyDTO, UpdateCompanyDTO } from '../types/companyType';
import { CustomError } from '../utils/customErrorUtil';

class CompanyRepository {
  /**
   * 회사 코드를 기준으로 회사를 조회합니다.
   * @param {string} companyCode - 회사 코드
   * @returns 회사 정보
   * @throws {CustomError} 회사를 찾지 못한 경우
   */
  getByCode = async (companyCode: string) => {
    const company = await prisma.company.findUnique({
      where: { companyCode },
      select: {
        id: true,
        companyName: true,
        companyCode: true,
      },
    });
    if (!company) {
      throw CustomError.notFound('존재하지 않는 회사입니다.');
    }
    return company;
  };

  /**
   * 새로운 회사를 생성합니다.
   * @param {CreateCompanyDTO} createCompanyDTO - 회사 생성에 필요한 정보
   * @returns 생성된 회사 정보 및 유저 수
   */
  create = async (createCompanyDTO: CreateCompanyDTO) => {
    let company = await prisma.company.create({
      data: createCompanyDTO,
      select: {
        id: true,
        companyName: true,
        companyCode: true,
        _count: { select: { user: true } },
      },
    });
    return company;
  };

  /**
   * 기존 회사의 정보를 업데이트합니다.
   * @param {UpdateCompanyDTO} updateCompanyDTO - 회사 정보 업데이트에 필요한 정보
   * @returns 업데이트된 회사 정보 및 유저 수
   */
  update = async (updateCompanyDTO: UpdateCompanyDTO) => {
    const { id, ...data } = updateCompanyDTO;
    const company = await prisma.company.update({
      where: { id },
      data,
      select: {
        id: true,
        companyName: true,
        companyCode: true,
        _count: { select: { user: true } },
      },
    });
    return company;
  };

  /**
   * 특정 회사를 삭제합니다.
   * @param {number} companyId - 삭제할 회사의 ID
   * @returns 없음
   */
  delete = async (companyId: number): Promise<void> => {
    await prisma.company.delete({
      where: {
        id: companyId,
      },
    });
  };

  /**
   * 회사 목록을 페이지네이션하여 가져옵니다.
   * @param {number} page - 페이지 번호
   * @param {number} pageSize - 페이지 당 항목 수
   * @param {Prisma.CompanyWhereInput} where - Prisma를 이용한 검색 조건
   * @returns 회사 목록 및 전체 항목 수
   */
  getCompanyList = async (page: number, pageSize: number, where: Prisma.CompanyWhereInput) => {
    const skip = (page - 1) * pageSize;
    const take = pageSize;

    const [data, totalItemCount] = await Promise.all([
      // 페이지네이션 된 회사 정보
      prisma.company.findMany({
        where,
        skip,
        take,
        select: {
          id: true,
          companyCode: true,
          companyName: true,
          _count: { select: { user: true } },
        },
      }),
      // 페이지에 포함되지 않는 전체 아이템 수까지 가져오기
      prisma.company.count({
        where,
      }),
    ]);

    // 페이지네이션 된 회사 정보들과 조건에 맞는 데이터 개수 전체 반환
    return {
      data,
      totalItemCount,
    };
  };
}

export default new CompanyRepository();
