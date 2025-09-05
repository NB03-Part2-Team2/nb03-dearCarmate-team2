import customerRepository from '../repositories/customerRepository';
import { Prisma } from '../generated/prisma';
import { CreateCustomerDTO, SearchParamListDTO } from '../types/customerType';
import { CustomError } from '../utils/customErrorUtil';

const reverseAgeGroupMap = {
  TEEN: '10대',
  TWENTY: '20대',
  THIRTY: '30대',
  FORTY: '40대',
  FIFTY: '50대',
  SIXTY: '60대',
  SEVENTY: '70대',
  EIGHTY: '80대',
};

const reverseRegionMap = {
  SEOUL: '서울',
  GYEONGGI: '경기',
  INCHEON: '인천',
  GANGWON: '강원',
  CHUNGBUK: '충북',
  CHUNGNAM: '충남',
  SEJONG: '세종',
  DAEJEON: '대전',
  JEONBUK: '전북',
  JEONNAM: '전남',
  GWANGJU: '광주',
  GYEONGBUK: '경북',
  GYEONGNAM: '경남',
  DAEGU: '대구',
  ULSAN: '울산',
  BUSAN: '부산',
  JEJU: '제주',
};

class CustomerService {
  /**
   * 새로운 고객 생성
   * @param {CreateCustomerDTO} data - 고객 정보
   * @param {number} userId - 사용자 ID
   * @returns {Promise<Customer>} 생성된 고객 객체 (ageGroup, region은 한글로 변환, contractCount 포함)
   */
  createCustomer = async (data: CreateCustomerDTO, userId: number) => {
    const companyId = await customerRepository.getCompanyId(userId);
    const customer = await customerRepository.createCustomer(data, companyId);
    const resCustomer = {
      ...customer,
      ageGroup: customer.ageGroup ? reverseAgeGroupMap[customer.ageGroup] : undefined,
      region: customer.region ? reverseRegionMap[customer.region] : undefined,
      contractCount: 0,
    };
    return resCustomer;
  };

  /**
   * 고객 목록 조회 (페이지네이션 및 검색)
   * @param {number} userId - 사용자 ID
   * @param {SearchParamListDTO} searchParams - 검색 및 페이지네이션 파라미터
   * @param {string} [searchParams.searchBy] - 검색 기준 ('name' | 'email')
   * @param {string} [searchParams.keyword] - 검색 키워드
   * @param {number} searchParams.page - 페이지 번호
   * @param {number} searchParams.pageSize - 페이지당 항목 수
   * @returns {Promise<{
   *   currentPage: number,
   *   totalPages: number,
   *   totalItemCount: number,
   *   data: Customer[]
   * }>} 페이지네이션된 고객 목록
   */
  getCustomerList = async (userId: number, searchParams: SearchParamListDTO) => {
    const { searchBy, keyword, page, pageSize } = searchParams;
    const validSearchBy = ['name', 'email'];
    if (searchBy && !validSearchBy.includes(searchBy)) {
      throw CustomError.badRequest();
    }
    const companyId = await customerRepository.getCompanyId(userId);
    let searchCondition: Prisma.CustomerWhereInput = {
      companyId: companyId,
    };
    if (searchBy && keyword) {
      if (searchBy === 'name') {
        searchCondition.name = {
          contains: keyword,
          mode: 'insensitive',
        };
      } else if (searchBy === 'email') {
        searchCondition.email = {
          contains: keyword,
          mode: 'insensitive',
        };
      }
    }
    const offset = (page - 1) * pageSize;
    const { customers, totalCount } = await customerRepository.getCustomerListByCompanyId(
      searchCondition,
      offset,
      pageSize,
    );
    const formattedCustomers = customers.map((customer) => {
      const { _count, ...rest } = customer;
      return {
        ...rest,
        ageGroup: rest.ageGroup ? reverseAgeGroupMap[rest.ageGroup] : undefined,
        region: rest.region ? reverseRegionMap[rest.region] : undefined,
        contractCount: _count.contract,
      };
    });
    const result = {
      currentPage: page,
      totalPages: Math.ceil(totalCount / pageSize),
      totalItemCount: totalCount,
      data: formattedCustomers,
    };
    return result;
  };

  /**
   * 기존 고객 정보 수정
   * @param {number} customerId - 고객 ID
   * @param {CreateCustomerDTO} data - 업데이트할 고객 정보
   * @returns {Promise<Customer>} 수정된 고객 객체 (ageGroup, region은 한글로 변환, contractCount 포함)
   */
  updateCustomer = async (customerId: number, data: CreateCustomerDTO) => {
    const customer = await customerRepository.updateCustomer(customerId, data);
    const { _count, ...rest } = customer;
    const resCustomer = {
      ...rest,
      ageGroup: rest.ageGroup ? reverseAgeGroupMap[rest.ageGroup] : undefined,
      region: rest.region ? reverseRegionMap[rest.region] : undefined,
      contractCount: _count.contract,
    };
    return resCustomer;
  };

  /**
   * 고객 삭제
   * @param {number} customerId - 고객 ID
   */
  deleteCustomer = async (customerId: number) => {
    const contracts = await customerRepository.getContractByCustomerId(customerId);
    if (contracts) {
      throw new CustomError('계약이 존재하는 고객은 삭제할 수 없습니다.', 409);
    }
    await customerRepository.deleteCustomer(customerId);
  };

  /**
   * 특정 고객 상세 정보 조회
   * @param {number} customerId - 고객 ID
   * @returns {Promise<Customer>} 고객 상세 정보 (ageGroup, region은 한글로 변환, contractCount 포함)
   */
  getCustomer = async (customerId: number) => {
    const customer = await customerRepository.getCustomer(customerId);
    if (!customer) {
      throw CustomError.notFound('존재하지 않는 고객입니다.');
    }
    const { _count, ...rest } = customer;
    const resCustomer = {
      ...rest,
      ageGroup: rest.ageGroup ? reverseAgeGroupMap[rest.ageGroup] : undefined,
      region: rest.region ? reverseRegionMap[rest.region] : undefined,
      contractCount: _count.contract,
    };
    return resCustomer;
  };

  /**
   * 대량 고객 등록
   * @param {CreateCustomerDTO[]} data - 고객 정보 배열
   * @param {number} userId - 사용자 ID
   */
  createManyCustomerList = async (data: CreateCustomerDTO[], userId: number) => {
    const companyId = await customerRepository.getCompanyId(userId);
    await customerRepository.createManyCustomerList(data, companyId);
  };
}

export default new CustomerService();
