export interface createUserDTO {
  // 유저-회원가입API 작성시 컨벤션 수정
  name: string;
  email: string;
  employeeNumber: string;
  phoneNumber: string;
  password: string;
  passwordConfirmation: string;
  company: string;
  companyCode: string;
}

export type UpdateUserDTO = Partial<{
  employeeNumber: string;
  phoneNumber: string;
  password: string;
  imageUrl: string | null;
  refreshToken: string;
}>;

export interface UserDTO {
  id: number;
  name: string;
  email: string;
  password: string;
  employeeNumber: string;
  phoneNumber: string;
  imageUrl: string | null;
  isAdmin: boolean;
  company: {
    companyCode: string;
  };
  refreshToken: string | null;
}

export interface LoginDTO {
  email: string;
  password: string;
}
