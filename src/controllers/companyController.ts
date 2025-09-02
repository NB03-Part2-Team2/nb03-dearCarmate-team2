import { Request, Response } from 'express';
import companyService from '../services/companyService';
import {
  createCompanySchema,
  deleteCompanySchema,
  updateCompanySchema,
} from '../validators/companySchema';
import { validator, paginationStruct } from '../validators/utilValidator';
import {
  CreateCompanyDTO,
  DeleteCompanyDTO,
  UpdateCompanyDTO,
  GetCompanyListDTO,
  GetCompanyUserListDTO,
} from '../types/companyType';

class CompanyController {
  createCompany = async (req: Request, res: Response) => {
    // 1. DTO 정의
    const createCompanyDTO: CreateCompanyDTO = {
      companyName: req.body.companyName as string,
      companyCode: req.body.companyCode as string,
    };
    // 2. 유효성 검사
    validator(createCompanyDTO, createCompanySchema);
    // 3. service레이어 호출
    const company = await companyService.createCompany(createCompanyDTO);
    // 4. 유저 정보 반환
    return res.status(201).json(company);
  };

  updateCompany = async (req: Request, res: Response) => {
    // 1. DTO 정의
    const updateCompanyDTO: UpdateCompanyDTO = {
      id: parseInt(req.params.companyId),
      companyName: req.body.companyName as string,
      companyCode: req.body.companyCode as string,
    };
    // 2. 유효성 검사
    validator(
      {
        id: req.params.companyId,
        companyName: req.body.companyName,
        companyCode: req.body.companyCode,
      },
      updateCompanySchema,
    );
    // 3. service레이어 호출
    const company = await companyService.updateCompany(updateCompanyDTO);
    // 4. 유저 정보 반환
    return res.status(201).json(company);
  };

  deleteCompany = async (req: Request, res: Response) => {
    // 1. DTO 정의
    const deleteCompanyDTO: DeleteCompanyDTO = {
      id: parseInt(req.params.companyId),
    };
    // 2. 유효성 검사 - req.params로 받은 유저 값은 검증되지 않았으므로 체크
    validator({ id: req.params.companyId }, deleteCompanySchema);
    // 3. service레이어 호출
    await companyService.deleteCompany(deleteCompanyDTO);
    // 4. 삭제 성공 메세지 반환
    return res.status(200).json({ message: '회사 삭제 성공' });
  };

  getCompanyList = async (req: Request, res: Response) => {
    // 1. DTO 정의
    const getCompanyListDTO: GetCompanyListDTO = {
      page: Number(req.query.page) ? Number(req.query.page) : undefined,
      pageSize: Number(req.query.pageSize) ? Number(req.query.pageSize) : undefined,
      searchBy: req.query.searchBy as string | undefined,
      keyword: req.query.keyword as string | undefined,
    };
    // 2. 유효성 검사 - req.query로 받은 유저 값은 검증되지 않았으므로 체크
    validator({ page: req.query.page, pageSize: req.query.pageSize }, paginationStruct);
    // 3. service레이어 호출
    const { companies, pageInfo } = await companyService.getCompanyList(getCompanyListDTO);
    // 4. 삭제 성공 메세지 반환
    return res.status(200).json({ ...pageInfo, data: companies });
  };

  getCompanyUserList = async (req: Request, res: Response) => {
    // 1. DTO 정의
    const getCompanyUserListDTO: GetCompanyUserListDTO = {
      page: Number(req.query.page) ? Number(req.query.page) : undefined,
      pageSize: Number(req.query.pageSize) ? Number(req.query.pageSize) : undefined,
      searchBy: req.query.searchBy as string | undefined,
      keyword: req.query.keyword as string | undefined,
    };
    // 2. 유효성 검사 - req.query로 받은 유저 값은 검증되지 않았으므로 체크
    validator({ page: req.query.page, pageSize: req.query.pageSize }, paginationStruct);
    // 3. service레이어 호출
    const { data, pageInfo } = await companyService.getCompanyUserList(getCompanyUserListDTO);
    // 4. 삭제 성공 메세지 반환
    return res.status(200).json({ ...pageInfo, data });
  };
}

export default new CompanyController();
