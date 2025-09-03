import { object, size, string } from 'superstruct';
import { utilValidator } from './utilValidator';

const createCompanySchema = object({
  companyName: utilValidator.companyName,
  companyCode: size(string(), 1, 20), // 별도 제한이 없었던것 같기에 길이만 검사
});

const updateCompanySchema = object({
  id: utilValidator.intId,
  companyName: utilValidator.companyName,
  companyCode: size(string(), 1, 20), // 별도 제한이 없었던것 같기에 길이만 검사
});

const deleteCompanySchema = object({
  id: utilValidator.intId,
});

export { createCompanySchema, updateCompanySchema, deleteCompanySchema };
