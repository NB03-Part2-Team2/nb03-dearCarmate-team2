import { create, object, optional, refine, size, string } from 'superstruct'

// const UTIL_VALIDATION_ERRORS = {
//   // tooShort: ''
//   name: '이름 형식에 맞지 않습니다.',
//   email: '이메일 형식에 맞지 않습니다.',
//   password: '비밀번호는 영문, 숫자 조합 8~16자리로 입력해주세요',
//   phoneNumber: '전화번호 형식에 맞지 않습니다(하이픈 포함 필요)'
// }

// function trimmed(value: any) {
//   if (value.trim().length >= 1) {
//     return value.trim()
//   }
//   throw new Error ''
// }

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

  carNumber: refine(size(string(), 7, 7), 'carNumberError', (value) => {
    return /^\d{2,3}[가나다라마거너더러머버서어저고노도로모보소오조구누두루무부수우주바사아자배허하호]\d{4}$/.test(value);
  }),

  companyName: refine(string(), 'companyNameError', (value) => {
    return /^[가-힣a-zA-Z0-9\s]+$/.test(value);
  }),

  employeeNumber: refine(string(), 'employeeNumberError', (value) => {
    return /^[a-zA-Z가-힣\-]+$/.test(value);
  })
};

const paginationStruct = object({
  page: optional(refine(string(), 'pageError', (value) => {
    return /^\d+$/.test(value) && Number(value) >= 1;
  })),
  pageSize: optional(refine(string(), 'pageSizeError', (value) => {
    return /^\d+$/.test(value) && Number(value) >= 1 && Number(value) <= 50;
  }))
})

const paginationValidator = (q: unknown) => {
  const {
    page = '1',
    pageSize = '8',
  } = create(q ?? {}, paginationStruct);

  const pageNum = parseInt(page, 10);
  const sizeNum = parseInt(pageSize, 10);

  return {
    page: pageNum,
    pageSize: sizeNum,
    skip: (pageNum - 1) * sizeNum,
    take: sizeNum
  } as const;
} 

export {
  utilValidator,
  paginationValidator
}