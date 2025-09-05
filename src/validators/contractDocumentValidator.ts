import { assert, object, string, optional, enums } from 'superstruct';
import { UploadContractDocumentDTO } from '../types/contractDocumentType';
import { utilValidator } from './utilValidator';

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

// 계약서 목록 조회 파라미터 검증 스키마
const SearchByContractDocument = ['contractName', 'userName', 'carNumber'];

export const getContractDocumentsParamsSchema = object({
  page: optional(utilValidator.page),
  pageSize: optional(utilValidator.pageSize),
  searchBy: optional(enums(SearchByContractDocument)),
  keyword: optional(string()),
});
