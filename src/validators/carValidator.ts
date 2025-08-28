import { object, create, size, string, assert } from 'superstruct';
import { utilValidator } from './utilValidator';
import { carDTO } from '../types/carType';
/**
 *
 * @param carDTO 입력받아 형식을 검증하는 validator 입니다.
 */
const createCarValidator = (createCarDTO: carDTO) => {
  const carStruct = object({
    carNumber: utilValidator.carNumber,
  });
  assert(createCarDTO, carStruct);
};

export { createCarValidator };
