import { object, assert, string, number } from 'superstruct';
import { utilValidator } from './utilValidator';
import { carDTO } from '../types/carType';
/**
 *
 * @param carDTO 입력받아 형식을 검증하는 validator 입니다.
 */
const createCarValidator = (createCarDTO: carDTO) => {
  const carStruct = object({
    carNumber: utilValidator.carNumber,
    model: string(),
    manufacturingYear: number(),
    mileage: number(),
    price: number(),
    accidentCount: number(),
    explanation: string(),
    accidentDetails: string(),
    company: string(),
  });
  assert(createCarDTO, carStruct);
};

export { createCarValidator };
