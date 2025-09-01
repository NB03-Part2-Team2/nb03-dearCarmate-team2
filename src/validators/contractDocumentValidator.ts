import { assert, object, string, optional, enums, refine } from 'superstruct';
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

// 계약서 목록 조회 파라미터 검증 스키마
const SearchByContractDocument = ['contractName', 'manager', 'carNumber'];

export const getContractDocumentsParamsSchema = object({
  page: optional(
    refine(string(), 'pageError', (value) => {
      return /^\d+$/.test(value) && Number(value) >= 1;
    }),
  ),
  pageSize: optional(
    refine(string(), 'pageSizeError', (value) => {
      return /^\d+$/.test(value) && Number(value) >= 1 && Number(value) <= 50;
    }),
  ),
  searchBy: optional(enums(SearchByContractDocument)),
  keyword: optional(string()),
});
