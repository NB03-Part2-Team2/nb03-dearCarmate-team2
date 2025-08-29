import prisma from '../libs/prisma';
import { Prisma } from '../generated/prisma';
import { CreateCustomerDTO } from '../types/customerType';
import { CustomError } from '../utils/customErrorUtil';
import { AgeGroup, Region } from '../generated/prisma';

// ageGroup과 region의 한글 값을 Prisma의 내부 enum 이름으로 매핑하는 객체
const ageGroupMap: { [key: string]: AgeGroup } = {
  '10대': 'TEEN',
  '20대': 'TWENTY',
  '30대': 'THIRTY',
  '40대': 'FORTY',
  '50대': 'FIFTY',
  '60대': 'SIXTY',
  '70대': 'SEVENTY',
  '80대': 'EIGHTY',
};

const regionMap: { [key: string]: Region } = {
  서울: 'SEOUL',
  경기: 'GYEONGGI',
  인천: 'INCHEON',
  강원: 'GANGWON',
  충북: 'CHUNGBUK',
  충남: 'CHUNGNAM',
  세종: 'SEJONG',
  대전: 'DAEJEON',
  전북: 'JEONBUK',
  전남: 'JEONNAM',
  광주: 'GWANGJU',
  경북: 'GYEONGBUK',
  경남: 'GYEONGNAM',
  대구: 'DAEGU',
  울산: 'ULSAN',
  부산: 'BUSAN',
  제주: 'JEJU',
};

class CustomerRepository {
  getCompanyId = async (userId: number) => {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        company: {
          select: {
            id: true,
          },
        },
      },
    });
    if (!user || !user.company) {
      throw CustomError.badRequest();
    }
    return user.company.id;
  };

  createCustomer = async (data: CreateCustomerDTO, companyId: number) => {
    // DTO의 한글 값을 Prisma가 이해하는 enum으로 변환하는 로직
    const prismaData = {
      ...data,
      ageGroup: data.ageGroup ? ageGroupMap[data.ageGroup] : undefined,
      region: data.region ? regionMap[data.region] : undefined,
      company: {
        connect: { id: companyId },
      },
    };

    const customer = await prisma.customer.create({
      data: prismaData,
      select: {
        id: true,
        name: true,
        gender: true,
        phoneNumber: true,
        ageGroup: true,
        region: true,
        email: true,
        memo: true,
      },
    });
    return customer;
  };

  getCustomerListByCompanyId = async (
    searchCondition: Prisma.CustomerWhereInput,
    skip: number,
    take: number,
  ) => {
    // 트랜잭션을 사용하여 두 가지 쿼리를 동시에 실행
    const [customers, totalCount] = await prisma.$transaction([
      prisma.customer.findMany({
        where: searchCondition,
        skip: skip,
        take: take,
        select: {
          id: true,
          name: true,
          gender: true,
          phoneNumber: true,
          ageGroup: true,
          region: true,
          email: true,
          memo: true,
          _count: {
            select: { contract: true },
          },
        },
      }),
      prisma.customer.count({
        where: searchCondition,
      }),
    ]);

    return { customers, totalCount };
  };
}

export default new CustomerRepository();
