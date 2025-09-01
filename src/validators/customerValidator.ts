import { object, string, refine, optional, enums, partial } from 'superstruct';
import { utilValidator } from './utilValidator';

const createCustomerSchema = object({
  name: utilValidator.name,
  gender: enums(['male', 'female']),
  phoneNumber: utilValidator.phoneNumber,
  email: utilValidator.email,
  memo: optional(string()),
  ageGroup: optional(
    enums(['TEEN', 'TWENTY', 'THIRTY', 'FORTY', 'FIFTY', 'SIXTY', 'SEVENTY', 'EIGHTY']),
  ),
  region: optional(
    enums([
      'SEOUL',
      'GYEONGGI',
      'INCHEON',
      'GANGWON',
      'CHUNGBUK',
      'CHUNGNAM',
      'SEJONG',
      'DAEJEON',
      'JEONBUK',
      'JEONNAM',
      'GWANGJU',
      'GYEONGBUK',
      'GYEONGNAM',
      'DAEGU',
      'ULSAN',
      'BUSAN',
      'JEJU',
    ]),
  ),
});

const updateCustomerSchema = partial(createCustomerSchema);

const page = optional(
  refine(string(), 'pageError', (value) => {
    return /^\d+$/.test(value) && Number(value) >= 1;
  }),
);
const pageSize = optional(
  refine(string(), 'pageSizeError', (value) => {
    return /^\d+$/.test(value) && Number(value) >= 1 && Number(value) <= 50;
  }),
);

const searchByOptions = ['name', 'email'];

const getCustomerListParamsSchema = object({
  page: page,
  pageSize: pageSize,
  searchBy: optional(enums(searchByOptions)),
  keyword: optional(string()),
});

const customerIdSchema = refine(string(), 'numeric_string', (value) => {
  const isNumeric = /^\d+$/.test(value);
  if (!isNumeric) {
    return '문자열이 유효한 숫자로만 구성되어야 합니다.';
  }
  return true;
});

export {
  createCustomerSchema,
  getCustomerListParamsSchema,
  customerIdSchema,
  updateCustomerSchema,
};
