export interface ListItemDTO {
  id: number;
  data: string;
}

export interface meetingsDTO {
  date: string;
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
