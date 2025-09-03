export interface CreateUserRequestDTO {
  name: string;
  email: string;
  employeeNumber: string;
  phoneNumber: string;
  password: string;
  passwordConfirmation: string;
  companyName: string;
  companyCode: string;
}

export interface CreateUserDTO {
  name: string;
  email: string;
  employeeNumber: string;
  phoneNumber: string;
  password: string;
  companyId: number;
}

export type UpdateUserDTO = Partial<{
  employeeNumber: string;
  phoneNumber: string;
  currentPassword: string;
  password: string;
  passwordConfirmation: string;
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

export interface GetUserDTO {
  id: number;
}

export interface DeleteUserDTO {
  id: number;
}
