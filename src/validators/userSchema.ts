import { object, size, string, optional, number, min } from 'superstruct';
import { utilValidator } from './utilValidator';

const createUserSchema = object({
  name: utilValidator.name,
  email: utilValidator.email,
  password: utilValidator.password,
  passwordConfirmation: utilValidator.password,
  employeeNumber: utilValidator.employeeNumber,
  phoneNumber: utilValidator.phoneNumber,
  company: utilValidator.companyName,
  companyCode: size(string(), 1, 20), // 별도 제한이 없었던것 같기에 길이만 검사
});

const updateUserSchema = object({
  currentPassword: utilValidator.password,
  password: optional(utilValidator.password),
  passwordConfirmation: optional(utilValidator.password),
  employeeNumber: optional(utilValidator.employeeNumber),
  phoneNumber: optional(utilValidator.phoneNumber),
  imageUrl: optional(string()),
  refreshToken: optional(string()),
});

const deleteUserSchema = object({
  id: min(number(), 1),
});

export { createUserSchema, updateUserSchema, deleteUserSchema };
