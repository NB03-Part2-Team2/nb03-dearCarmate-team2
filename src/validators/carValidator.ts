import { object, string, number, enums, optional, size } from 'superstruct';
import { utilValidator } from './utilValidator';
/**
 *
 * @param carDTO 입력받아 형식을 검증하는 validator 입니다.
 */

const intIdSchema = utilValidator.intId;

const createCarSchema = object({
  carNumber: utilValidator.carNumber,
  model: string(),
  manufacturingYear: size(number(), 1000, 9999),
  mileage: number(),
  price: number(),
  accidentCount: number(),
  explanation: size(string(), 0, 255),
  accidentDetails: size(string(), 0, 255),
});

const getCarListSchema = object({
  page: optional(number()),
  pageSize: optional(number()),
  status: optional(enums(['possession', 'contractProceeding', 'contractCompleted'])),
  searchBy: optional(enums(['carNumber', 'model'])),
  keyword: optional(string()),
});

const updateCarSchema = object({
  carNumber: utilValidator.carNumber,
  manufacturer: string(),
  model: string(),
  manufacturingYear: size(number(), 1000, 9999),
  mileage: number(),
  price: number(),
  accidentCount: number(),
  explanation: size(string(), 0, 255),
  accidentDetails: size(string(), 0, 255),
});

export { intIdSchema, createCarSchema, getCarListSchema, getCarSchema, updateCarSchema };
