export interface UploadContractDocumentDTO {
  fileName: string;
}

export interface UploadContractDocumentResponseDTO {
  contractDocumentId: number;
}

// 계약서 목록 조회를 위한 타입들
export type GetContractDocumentsParamsDTO = {
  page?: number;
  pageSize?: number;
  searchBy?: 'contractName' | 'manager' | 'carNumber';
  keyword?: string;
};

export type OffsetPagination<T> = {
  currentPage: number;
  totalPages: number;
  totalItemCount: number;
  data: T[];
};

export type ContractDocumentListDTO = {
  id: number;
  contractName: string;
  resolutionDate: string | null;
  documentCount: number;
  manager: string;
  carNumber: string;
  documents: {
    id: number;
    fileName: string;
  }[];
};
