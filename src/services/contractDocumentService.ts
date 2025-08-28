import contractDocumentRepository from '../repositories/contractDocumentRepository';
import { CustomError } from '../utils/customErrorUtil';
import type {
  UploadContractDocumentDTO,
  UploadContractDocumentResponseDTO,
} from '../types/contractDocumentType';

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
      throw CustomError.badRequest('계약서 문서를 찾을 수 없습니다.');
    }
    return contractDocument;
  };
}

export default new ContractDocumentService();
