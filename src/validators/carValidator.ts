import { object, string, number, enums, optional, size, array, nullable } from 'superstruct';
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
  explanation: optional(nullable(size(string(), 0, 255))),
  accidentDetails: optional(nullable(size(string(), 0, 255))),
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
  explanation: optional(nullable(size(string(), 0, 255))),
  accidentDetails: optional(nullable(size(string(), 0, 255))),
});

const uploadCarListSchema = object({
  carNumber: utilValidator.carNumber,
  manufacturer: string(),
  model: string(),
  manufacturingYear: size(number(), 1000, 9999),
  mileage: number(),
  price: number(),
  accidentCount: number(),
  explanation: optional(nullable(size(string(), 0, 255))),
  accidentDetails: optional(nullable(size(string(), 0, 255))),
});

const uploadCarListValidator = array(uploadCarListSchema);

export { intIdSchema, createCarSchema, getCarListSchema, updateCarSchema, uploadCarListValidator };
