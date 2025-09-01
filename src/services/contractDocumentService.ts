import contractDocumentRepository from '../repositories/contractDocumentRepository';
import contractRepository from '../repositories/contractRepository';
import type {
  UploadContractDocumentDTO,
  UploadContractDocumentResponseDTO,
  GetContractDocumentsParamsDTO,
} from '../types/contractDocumentType';
import { CustomError } from '../utils/customErrorUtil';

class ContractDocumentService {
  /**
   * 계약서 문서를 업로드하고 등록합니다.
   */
  uploadContractDocument = async (
    uploadDTO: UploadContractDocumentDTO,
  ): Promise<UploadContractDocumentResponseDTO> => {
    // 계약서 문서 생성
    const contractDocument = await contractDocumentRepository.create(uploadDTO.fileName);

    return {
      contractDocumentId: contractDocument.id,
    };
  };

  /**
   * 계약서 문서를 조회합니다.
   */
  getContractDocument = async (contractDocumentId: number) => {
    // 계약서 문서 조회
    const contractDocument = await contractDocumentRepository.findById(contractDocumentId);
    if (!contractDocument) {
      throw CustomError.notFound('계약서 문서를 찾을 수 없습니다.');
    }
    return contractDocument;
  };

  /**
   * 계약서 목록을 조회합니다.
   */
  getContractDocumentList = async (
    { page, pageSize, searchBy, keyword }: GetContractDocumentsParamsDTO,
    userId: number,
  ) => {
    // 사용자의 회사 ID 조회
    const companyId = await contractRepository.getCompanyId(userId);

    // 계약서 목록 조회
    const result = await contractDocumentRepository.findContractDocumentList(
      { page, pageSize, searchBy, keyword },
      companyId,
    );

    return result;
  };
}

export default new ContractDocumentService();
