import { object, string, refine, optional, enums, partial, nullable } from 'superstruct';
import { utilValidator } from './utilValidator';

const createCustomerSchema = object({
  name: utilValidator.name,
  gender: enums(['male', 'female']),
  phoneNumber: utilValidator.phoneNumber,
  email: utilValidator.email,
  memo: optional(nullable(string())),
  ageGroup: optional(
    nullable(enums(['10대', '20대', '30대', '40대', '50대', '60대', '70대', '80대'])),
  ),
  region: optional(
    nullable(
      enums([
        '서울',
        '경기',
        '인천',
        '강원',
        '충북',
        '충남',
        '세종',
        '대전',
        '전북',
        '전남',
        '광주',
        '경북',
        '경남',
        '대구',
        '울산',
        '부산',
        '제주',
      ]),
    ),
  ),
});

const updateCustomerSchema = partial(createCustomerSchema);

const searchByOptions = ['name', 'email'];

const getCustomerListParamsSchema = object({
  page: optional(utilValidator.page),
  pageSize: optional(utilValidator.pageSize),
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
