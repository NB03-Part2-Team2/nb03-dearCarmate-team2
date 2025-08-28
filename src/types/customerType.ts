export interface CreateCustomerDTO {
  name: string;
  gender: 'male' | 'female';
  phoneNumber: string;
  // Prisma의 내부 enum 이름 사용
  ageGroup?: 'TEEN' | 'TWENTY' | 'THIRTY' | 'FORTY' | 'FIFTY' | 'SIXTY' | 'SEVENTY' | 'EIGHTY';
  region?:
    | 'SEOUL'
    | 'GYEONGGI'
    | 'INCHEON'
    | 'GANGWON'
    | 'CHUNGBUK'
    | 'CHUNGNAM'
    | 'SEJONG'
    | 'DAEJEON'
    | 'JEONBUK'
    | 'JEONNAM'
    | 'GWANGJU'
    | 'GYEONGBUK'
    | 'GYEONGNAM'
    | 'DAEGU'
    | 'ULSAN'
    | 'BUSAN'
    | 'JEJU';
  email: string;
  memo?: string;
}

export interface SearchParamsDTO {
  searchBy?: 'name' | 'email';
  keyword?: string;
  page: number;
  pageSize: number;
}
