export interface carDTO {
  carNumber: string;
  model: string;
  manufacturingYear: number;
  mileage: number;
  price: number;
  accidentCount: number;
  explanation?: string;
  accidentDetails?: string;
  status: CarStatus;
}

type CarStatus = 'possession' | 'contractProceeding' | 'contractCompleted' | undefined;

export interface carListDTO {
  page: number;
  pageSize: number;
  skip?: number;
  take?: number;
  keyword: string;
  searchBy: 'carNumber' | 'model';
  status: CarStatus;
}
