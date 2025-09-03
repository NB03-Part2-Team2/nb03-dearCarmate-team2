import prisma from '../libs/prisma';
import { Prisma } from '../generated/prisma';
import { CreateCompanyDTO, UpdateCompanyDTO } from '../types/companyType';
import { CustomError } from '../utils/customErrorUtil';

class CompanyRepository {
  /**
   *
   * @param companyCode companyCode 를 받습니다
   * @returns 해당하는 company가 있는 경우 해당 회사의 id를 리턴, 없는 경우 error을 throw합니다.
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

  delete = async (companyId: number): Promise<void> => {
    await prisma.company.delete({
      where: {
        id: companyId,
      },
    });
  };

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
