import { ContractStatus } from '../generated/prisma';

export interface ListItemDTO {
  id: number;
  data: string;
}

export interface meetingsDTO {
  date: Date;
  alarms: string[];
}

export interface carDTO {
  id: number;
  price: number;
  status: string;
}

export interface createContractDTO {
  carId: number;
  customerId: number;
  meetings: meetingsDTO[];
}

export interface ContractDTO {
  id: number;
  car: CarDTO;
  customer: ItemDTO;
  user: ItemDTO;
  meetings: meetingsDTO[];
  contractPrice: number;
  resolutionDate: Date | null;
  status: string;
}

export interface FormattedContractsDTO {
  [status: string]: {
    totalItemCount: number;
    data: ContractDTO[];
  };
}

export interface CarDTO {
  id: number;
  model: string;
}

export interface ItemDTO {
  id: number;
  name: string;
}

export interface UpdateContractDTO {
  status?: ContractStatus;
  resolutionDate?: Date | null;
  contractPrice?: number;
  userId?: number;
  customerId?: number;
  carId?: number;
  isMeetingChanged: boolean;
  meetings?: meetingsDTO[];
  isContractDocumentsChanged: boolean;
  contractDocuments?: ContractDocumentDTO[];
}

export interface ContractDocumentDTO {
  id?: number;
  fileName: string;
}
