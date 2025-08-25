export type UpdateUserDto = Partial<{
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
