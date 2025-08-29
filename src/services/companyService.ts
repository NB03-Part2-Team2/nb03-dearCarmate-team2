import companyRepository from '../repositories/companyRepository';
import userRepository from '../repositories/userRepository';
import { CreateCompanyDTO, DeleteCompanyDTO, UpdateCompanyDTO } from '../types/companyType';
import { CustomError } from '../utils/customErrorUtil';

class CompanyService {
  createCompany = async (createCompanyDTO: CreateCompanyDTO) => {
    // 1. 데이터 생성
    const company = await companyRepository.create(createCompanyDTO);
    // 2. count 분리
    const { _count, ...companyData } = company;
    // 3. 회사 정보와 유저 수를 형식에 맞춰 반환
    return { ...companyData, userCount: _count.user };
  };

  updateCompany = async (updateCompanyDTO: UpdateCompanyDTO) => {
    try {
      // 1. 데이터 업데이트
      const company = await companyRepository.update(updateCompanyDTO);
      // 2. count 분리
      const { _count, ...companyData } = company;
      // 3. 회사 정보와 유저 수를 형식에 맞춰 반환
      return { ...companyData, userCount: _count.user };
    } catch (err: any) {
      if (err.name === 'PrismaClientKnownRequestError' && (err as any).code === 'P2025') {
        throw CustomError.notFound('존재하지 않는 회사입니다');
      } else {
        throw err;
      }
    }
  };

  deleteCompany = async (deleteCompanyDTO: DeleteCompanyDTO) => {
    try {
      await userRepository.delete(deleteCompanyDTO.id);
    } catch (err: any) {
      if (err.name === 'PrismaClientKnownRequestError' && (err as any).code === 'P2025') {
        throw CustomError.notFound('존재하지 않는 회사입니다');
      } else {
        throw err;
      }
    }
  };
}

export default new CompanyService();
