import { Prisma } from '../generated/prisma';
import companyRepository from '../repositories/companyRepository';
import userRepository from '../repositories/userRepository';
import {
  CreateCompanyDTO,
  DeleteCompanyDTO,
  GetCompanyListDTO,
  GetCompanyUserListDTO,
  UpdateCompanyDTO,
} from '../types/companyType';
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
      await companyRepository.delete(deleteCompanyDTO.id);
    } catch (err: any) {
      if (err.name === 'PrismaClientKnownRequestError' && (err as any).code === 'P2025') {
        throw CustomError.notFound('존재하지 않는 회사입니다');
      } else {
        throw err;
      }
    }
  };

  getCompanyList = async (getCompanyListDTO: GetCompanyListDTO) => {
    const { page = 1, pageSize = 8, searchBy = 'companyName', keyword = '' } = getCompanyListDTO;
    // 1. searchBy의 값이 유효한지 검사
    const validSearchBy = ['companyName'];
    if (searchBy && !validSearchBy.includes(searchBy)) {
      throw CustomError.badRequest();
    }
    // 2. 검색 조건 설정, 추후 확장 가능성도 있으므로 where 조건을 else if 로 확장할 수 있게 구성
    let where: Prisma.CompanyWhereInput = {};
    if (searchBy === 'companyName') {
      where = {
        ...where,
        companyName: {
          contains: keyword,
          mode: 'insensitive',
        },
      };
    }
    // 3. 회사 목록 검색
    const { data, totalItemCount } = await companyRepository.getCompanyList(page, pageSize, where);

    // 4-1. 회사 정보 형식 변환
    const formattedCompanies = data.map((company) => {
      const { _count, ...companyData } = company;
      return { ...companyData, userCount: _count.user };
    });
    // 4-2. 페이지 정보
    const pageInfo = {
      currentPage: page,
      totalPages:
        totalItemCount % pageSize === 0
          ? totalItemCount / pageSize
          : (totalItemCount - (totalItemCount % pageSize)) / pageSize + 1,
      totalItemCount,
    };
    // 5. 데이터 반환
    return { companies: formattedCompanies, pageInfo };
  };

  getCompanyUserList = async (getCompanyUserListDTO: GetCompanyUserListDTO) => {
    const {
      page = 1,
      pageSize = 8,
      searchBy = 'companyName',
      keyword = '',
    } = getCompanyUserListDTO;
    // 1. searchBy의 값이 유효한지 검사
    const validSearchBy = ['companyName', 'email', 'name'];
    if (searchBy && !validSearchBy.includes(searchBy)) {
      throw CustomError.badRequest();
    }
    // 2. 검색 조건 설정, 추후 확장 가능성도 있으므로 where 조건을 else if 로 확장할 수 있게 구성
    let where: Prisma.UserWhereInput = {};
    if (searchBy === 'companyName') {
      where = {
        ...where,
        company: {
          companyName: {
            contains: keyword,
            mode: 'insensitive',
          },
        },
      };
    } else if (searchBy === 'email') {
      where = {
        ...where,
        email: {
          contains: keyword,
          mode: 'default', // 이메일은 대소문자 구분
        },
      };
    } else if (searchBy === 'name') {
      where = {
        ...where,
        name: {
          contains: keyword,
          mode: 'insensitive',
        },
      };
    }
    // 3. 회사 목록 검색
    const { data, totalItemCount } = await userRepository.getUserList(page, pageSize, where);

    // 4. 페이지 정보
    const pageInfo = {
      currentPage: page,
      totalPages:
        totalItemCount % pageSize === 0
          ? totalItemCount / pageSize
          : (totalItemCount - (totalItemCount % pageSize)) / pageSize + 1,
      totalItemCount,
    };
    // 5. 데이터 반환
    return { data, pageInfo };
  };
}

export default new CompanyService();
