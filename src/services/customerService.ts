import customerRepository from '../repositories/customerRepository';
import { CreateCustomerDTO } from '../types/customerType';

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
}

export default new CustomerService();
