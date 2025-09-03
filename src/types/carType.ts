type CarStatus = 'possession' | 'contractProceeding' | 'contractCompleted';

export interface carDTO {
  carNumber: string;
  manufacturer: string;
  model: string;
  manufacturingYear: number;
  mileage: number;
  price: number;
  accidentCount: number;
  explanation?: string;
  accidentDetails?: string;
  status: CarStatus;
}

export interface carListDTO {
  page: number;
  pageSize: number;
  skip?: number;
  take?: number;
  keyword?: string;
  searchBy?: 'carNumber' | 'model';
  status?: CarStatus | undefined;
}

export interface rawCar {
  id: number;
  carNumber: string;
  manufacturingYear: number;
  mileage: number;
  price: number;
  accidentCount: number;
  explanation?: string | null;
  accidentDetails?: string | null;
  status: CarStatus;
  carModel: {
    manufacturer: string;
    model: string;
    type: string;
  };
}
