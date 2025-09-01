export interface CreateCompanyDTO {
  companyName: string;
  companyCode: string;
}

export interface UpdateCompanyDTO extends CreateCompanyDTO {
  id: number;
}

export interface DeleteCompanyDTO {
  id: number;
}
