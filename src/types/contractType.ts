export interface ListItemDTO {
  id: number;
  data: string;
}

export interface meetingsDTO {
  date: Date;
  alarms: string[];
}

export interface carPriceDTO {
  id: number;
  price: number;
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

export interface formattedContractsDTO {
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
