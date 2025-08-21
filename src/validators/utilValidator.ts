import { refine, size, string } from 'superstruct';

const UTIL_VALIDATION_ERRORS = {
  // tooShort: ''
  name: '이름 형식에 맞지 않습니다.',
  email: '이메일 형식에 맞지 않습니다.',
  password: '비밀번호는 영문, 숫자 조합 8~16자리로 입력해주세요',
  phoneNumber: '전화번호 형식에 맞지 않습니다(하이픈 포함 필요)'
}

// function trimmed(value: any) {
//   if (value.trim().length >= 1) {
//     return value.trim()
//   }
//   throw new Error ''
// }

const utilValidator = {
  name: refine(size(string(), 2, 50), 'nameError', (value) => {
    return /^[가-힣]+$/.test(value) || /^[a-zA-Z]+$/.test(value);
  }),

  email: refine(size(string(), 1, 50), 'emailError', (value) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
  }),

  phoneNumber: refine(size(string(), 1, 13), 'phoneNumberError', (value) => {
    return /^01[0-9]-\d{3,4}-\d{4}$/.test(value.trim());
  }),

  password: refine(size(string(), 8, 16), 'passwordError', (value) => {
    return /^[a-zA-Z0-9]+$/.test(value);
  })
};

const paginationValidator = {

}

export {
  utilValidator,
  paginationValidator
}