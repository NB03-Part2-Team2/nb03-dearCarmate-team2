import contractDocumentRepository from '../repositories/contractDocumentRepository';
import contractRepository from '../repositories/contractRepository';
import type {
  UploadContractDocumentDTO,
  UploadContractDocumentResponseDTO,
  GetContractDocumentsParamsDTO,
  DropdownDTO,
  DraftContractDTO,
  ContractDocumentListDTO,
  OffsetPagination,
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
  ): Promise<OffsetPagination<ContractDocumentListDTO>> => {
    // 사용자의 회사 ID 조회
    const companyId = await contractRepository.getCompanyId(userId);

    // 계약서 목록 조회
    const {
      contracts,
      totalItemCount,
      page: currentPage,
      pageSize: currentPageSize,
    } = await contractDocumentRepository.findContractDocumentList(
      { page, pageSize, searchBy, keyword },
      companyId,
    );

    // 패이지 수 계산
    const totalPages =
      totalItemCount % currentPageSize === 0
        ? totalItemCount / currentPageSize
        : (totalItemCount - (totalItemCount % currentPageSize)) / currentPageSize + 1;

    // 응답 데이터 변환
    const data: ContractDocumentListDTO[] = contracts.map((contract) => ({
      id: contract.id,
      contractName: `${contract.car.model} - ${contract.customer.name} 고객님`,
      resolutionDate: contract.resolutionDate?.toISOString() || null,
      documentCount: contract.contractDocumentRelation.length,
      manager: contract.user.name,
      carNumber: contract.car.carNumber,
      documents: contract.contractDocumentRelation.map((relation) => ({
        id: relation.contractDocument.id,
        fileName: relation.contractDocument.fileName,
      })),
    }));

    return {
      currentPage,
      totalPages,
      totalItemCount,
      data,
    };
  };

  /**
   * 계약서 작성 중인 거래 목록을 조회합니다.
   */
  getDraftContractList = async (userId: number): Promise<DropdownDTO[]> => {
    // 사용자의 회사 ID 조회
    const companyId = await contractRepository.getCompanyId(userId);

    // 계약서 작성 중인 계약 목록 조회
    const draftContracts: DraftContractDTO[] =
      await contractDocumentRepository.findDraftContractList(companyId);

    // 드롭다운 형식으로 변환
    const formattedContracts: DropdownDTO[] = draftContracts.map((contract) => ({
      id: contract.id,
      data: `${contract.car.model} - ${contract.customer.name} 고객님`,
    }));

    return formattedContracts;
  };
}

export default new ContractDocumentService();
