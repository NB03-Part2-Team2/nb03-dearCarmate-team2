import { refine, size, string, Struct, assert, optional, object } from 'superstruct';

const validator = <T, U>(data: T, schema: Struct<U>) => {
  assert(data, schema);
};

/**
 * @example
 *
 * 1. 필요한 필드를 뽑아 스키마 정의
 *
 * const somethingSchema = object({
 *  name: utilValidator.name
 *  email: utilValidator.email,
 *  phoneNumber: utilValidator.password,
 *  companyName: optional(utilValidator.companyName),
 *  employeeNumber: optional(utilValidator.employeeNumber),
 *  carNumber: otional(utilValidator.carNumber),
 * });
 *
 * 2. 컨트롤러에서 검증
 * ...
 * validator(req.body, somethingStruct);
 * ...
 *
 */

const utilValidator = {
  name: refine(size(string(), 2, 50), 'nameError', (value) => {
    return /^[가-힣]+$/.test(value) || /^[a-zA-Z\s]+$/.test(value);
  }),

  email: refine(size(string(), 1, 50), 'emailError', (value) => {
    return /^[^ㄱ-힣\s@]+@[A-Za-z0-9-]+(\.[A-Za-z0-9-]+)+$/.test(value);
  }),

  phoneNumber: refine(size(string(), 12, 13), 'phoneNumberError', (value) => {
    return /^01[0-9]-\d{3,4}-\d{4}$/.test(value);
  }),

  password: refine(size(string(), 8, 16), 'passwordError', (value) => {
    return /^[a-zA-Z0-9]+$/.test(value);
  }),

  carNumber: refine(size(string(), 7, 8), 'carNumberError', (value) => {
    return /^\d{2,3}[가나다라마거너더러머버서어저고노도로모보소오조구누두루무부수우주바사아자배허하호]\d{4}$/.test(
      value,
    );
  }),

  companyName: refine(string(), 'companyNameError', (value) => {
    return /^[가-힣a-zA-Z0-9\s]+$/.test(value);
  }),

  employeeNumber: refine(string(), 'employeeNumberError', (value) => {
    return /^[a-zA-Z가-힣0-9\-]+$/.test(value);
  }),
};

const paginationStruct = object({
  page: optional(
    refine(string(), 'pageError', (value) => {
      return /^\d+$/.test(value) && Number(value) >= 1;
    }),
  ),
  pageSize: optional(
    refine(string(), 'pageSizeError', (value) => {
      return /^\d+$/.test(value) && Number(value) >= 1 && Number(value) <= 50;
    }),
  ),
});

export { utilValidator, paginationStruct, validator };
