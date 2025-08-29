import { object, string, number, enums, optional } from 'superstruct';
import { utilValidator } from './utilValidator';
/**
 *
 * @param carDTO 입력받아 형식을 검증하는 validator 입니다.
 */
const createCarSchema = object({
  carNumber: utilValidator.carNumber,
  model: string(),
  manufacturingYear: number(),
  mileage: number(),
  price: number(),
  accidentCount: number(),
  explanation: string(),
  accidentDetails: string(),
});

const getCarListSchema = object({
  page: optional(number()),
  pageSize: optional(number()),
  status: optional(enums(['possession', 'contractProceeding', 'contractCompleted'])),
  searchBy: optional(enums(['carNumber', 'model'])),
  keyword: optional(string()),
});

const getCarSchema = object({
  carId: number(),
});

export { createCarSchema, getCarListSchema, getCarSchema };
