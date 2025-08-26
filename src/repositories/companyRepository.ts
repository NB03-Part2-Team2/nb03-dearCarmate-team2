import prisma from '../libs/prisma';
import { CustomError } from '../utils/customErrorUtil';

class CompanyRepository {
  /**
   *
   * @param companyCode companyCode 를 받습니다
   * @returns 해당하는 company가 있는 경우 해당 회사의 id를 리턴, 없는 경우 error을 throw합니다.
   */
  getIdByCode = async (companyCode: string): Promise<number> => {
    const companyId = await prisma.company.findUnique({
      where: { companyCode },
      select: {
        id: true,
      },
    });
    if (!companyId) {
      throw CustomError.notFound('존재하지 않는 회사입니다.');
    }
    return companyId.id;
  };
}

export default new CompanyRepository();
