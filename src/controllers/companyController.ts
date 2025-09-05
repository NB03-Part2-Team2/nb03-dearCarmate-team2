import { Request, Response } from 'express';
import companyService from '../services/companyService';
import {
  createCompanySchema,
  deleteCompanySchema,
  updateCompanySchema,
} from '../validators/companyValidator';
import { validator, paginationStruct } from '../validators/utilValidator';
import {
  CreateCompanyDTO,
  DeleteCompanyDTO,
  UpdateCompanyDTO,
  GetCompanyListDTO,
  GetCompanyUserListDTO,
} from '../types/companyType';

class CompanyController {
  /**
   * 새로운 회사를 생성합니다.
   * @param {string} req.body.companyName - 회사 이름
   * @param {string} req.body.companyCode - 회사 코드
   * @returns 생성된 회사 정보를 담은 JSON 응답
   */
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

  /**
   * 기존 회사의 정보를 업데이트합니다.
   * @param {number} req.params.companyId - 회사 ID (URL 파라미터)
   * @param {string} req.body.companyName - 새 회사 이름
   * @param {string} req.body.companyCode - 새 회사 코드
   * @returns 업데이트된 회사 정보를 담은 JSON 응답
   */
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

  /**
   * 특정 회사를 삭제합니다.
   * @param {number} req.params.companyId - 삭제할 회사의 ID (URL 파라미터)
   * @returns 성공 메시지를 담은 JSON 응답
   */
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

  /**
   * 회사 목록을 페이지네이션하여 가져옵니다.
   * @param {number} [req.query.page] - (선택) 페이지 번호
   * @param {number} [req.query.pageSize] - (선택) 페이지 당 항목 수
   * @param {string} [req.query.searchBy] - (선택) 검색 기준 (e.g., 'name', 'code')
   * @param {string} [req.query.keyword] - (선택) 검색어
   * @returns 페이지 정보와 회사 목록을 담은 JSON 응답
   */
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
    // 4. 페이지 정보 및 회사 정보 반환
    return res.status(200).json({ ...pageInfo, data: companies });
  };

  /**
   * 특정 회사에 속한 사용자 목록을 페이지네이션하여 가져옵니다.
   * @param {number} [req.query.page] - (선택) 페이지 번호
   * @param {number} [req.query.pageSize] - (선택) 페이지 당 항목 수
   * @param {string} [req.query.searchBy] - (선택) 검색 기준 (e.g., 'name', 'email')
   * @param {string} [req.query.keyword] - (선택) 검색어
   * @returns 페이지 정보와 사용자 목록을 담은 JSON 응답
   */
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
    // 4. 페이지 정보 및 유저 정보 반환
    return res.status(200).json({ ...pageInfo, data });
  };
}

export default new CompanyController();
