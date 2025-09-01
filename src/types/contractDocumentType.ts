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

// Repository에서 반환하는 원시 데이터 타입
export interface ContractDocumentRawData {
  contracts: Array<{
    id: number;
    resolutionDate: Date | null;
    user: { name: string };
    car: { carNumber: string; model: string };
    customer: { name: string };
    contractDocumentRelation: Array<{
      contractDocument: { id: number; fileName: string };
    }>;
  }>;
  totalItemCount: number;
  page: number;
  pageSize: number;
}

// 드롭다운 타입
export interface DropdownDTO {
  id: number;
  data: string;
}

// 드래프트 계약 조회 결과 타입
export interface DraftContractDTO {
  id: number;
  car: {
    model: string;
  };
  customer: {
    name: string;
  };
}
