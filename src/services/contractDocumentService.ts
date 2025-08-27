import contractDocumentRepository from '../repositories/contractDocumentRepository';
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
}

export default new ContractDocumentService();
