import { assert, object, string } from 'superstruct';
import { UploadContractDocumentDTO } from '../types/contractDocumentType';

/**
 *
 * @param uploadDTO fileName을 입력받아 형식을 검증하는 validator 입니다.
 * @returns 검증된 DTO 객체
 */
const uploadContractDocumentValidator = (uploadDTO: UploadContractDocumentDTO) => {
  const uploadStruct = object({
    fileName: string(),
  });

  assert(uploadDTO, uploadStruct);
};

export { uploadContractDocumentValidator };
