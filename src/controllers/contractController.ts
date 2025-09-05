import { Request, Response, NextFunction } from 'express';
import { createContractDTO, UpdateContractDTO } from '../types/contractType';
import contractService from '../services/contractService';
import { validator } from '../validators/utilValidator';
import {
  createContractBodySchema,
  getContractListParamsSchema,
  contractIdSchema,
  updateContractBodySchema,
} from '../validators/contractValidator';

class ContractController {
  /**
   * 계약 생성 시 사용 가능한 차량 목록 조회
   * @param {number} req.user.userId - 로그인한 사용자 ID
   * @returns 200: 차량 목록 배열 [{id, data: "모델명(차량번호)"}]
   * @throws {Error} DB 에러, 회사 ID 조회 실패
   */
  getCarListForContract = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user!.userId;
      const cars = await contractService.getCarListInCompany(userId);
      res.status(200).json(cars);
    } catch (error) {
      next(error);
    }
  };

  /**
   * 계약 생성 시 사용 가능한 고객 목록 조회
   * @param {number} req.user.userId - 로그인한 사용자 ID
   * @returns 200: 고객 목록 배열 [{id, data: "이름(이메일)"}]
   * @throws {Error} DB 에러, 회사 ID 조회 실패
   */
  getCustomerListForContract = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user!.userId;
      const customers = await contractService.getCustomerListInCompany(userId);
      res.status(200).json(customers);
    } catch (error) {
      next(error);
    }
  };

  /**
   * 계약 생성 시 사용 가능한 담당자 목록 조회
   * @param {number} req.user.userId - 로그인한 사용자 ID
   * @returns 200: 담당자 목록 배열 [{id, data: "이름(이메일)"}]
   * @throws {Error} DB 에러, 회사 ID 조회 실패
   */
  getUserListForContract = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user!.userId;
      const users = await contractService.getUserListInCompany(userId);
      res.status(200).json(users);
    } catch (error) {
      next(error);
    }
  };

  /**
   * 새로운 계약 생성
   * @param {number} req.user.userId - 로그인한 사용자 ID
   * @param {number} req.body.carId - 차량 ID
   * @param {number} req.body.customerId - 고객 ID
   * @param {meetingsDTO[]} req.body.meetings - 미팅 일정 배열
   * @returns 201: 생성된 계약 객체
   * @throws {CustomError} 유효성 검사 실패, 차량이 존재하지 않거나 possession 상태가 아닌 경우, DB 트랜잭션 실패
   */
  createContract = async (
    req: Request<{}, {}, createContractDTO>,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      validator(req.body, createContractBodySchema);
      const userId = req.user!.userId;
      const { carId, customerId, meetings } = req.body;
      const contract = await contractService.createContract(userId, carId, customerId, meetings);
      res.status(201).json(contract);
    } catch (error) {
      next(error);
    }
  };

  /**
   * 회사 내 계약 목록 조회 (검색 기능 포함)
   * @param {number} req.user.userId - 로그인한 사용자 ID
   * @param {string} [req.query.searchBy] - 검색 기준 ('customerName' | 'userName')
   * @param {string} [req.query.keyword] - 검색 키워드
   * @returns 200: 상태별로 그룹화된 계약 목록 객체
   * @throws {CustomError} 유효성 검사 실패, 유효하지 않은 searchBy 값, DB 에러
   */
  getContractListInCompany = async (req: Request, res: Response, next: NextFunction) => {
    try {
      validator(req.query, getContractListParamsSchema);
      const userId = req.user!.userId;
      const searchBy = req.query.searchBy as string | undefined;
      const keyword = req.query.keyword as string | undefined;
      const contracts = await contractService.getContractListInCompany(userId, searchBy, keyword);
      res.status(200).json(contracts);
    } catch (error) {
      next(error);
    }
  };

  /**
   * 기존 계약 정보 수정
   * @param {number} req.user.userId - 로그인한 사용자 ID
   * @param {string} req.params.contractId - 계약 ID
   * @param {UpdateContractDTO} req.body - 업데이트할 계약 정보
   * @returns 200: 수정된 계약 객체
   * @throws {CustomError} 유효성 검사 실패, 권한 없음 (본인의 계약이 아닌 경우), DB 트랜잭션 실패, 이메일 발송 에러
   */
  updateContract = async (req: Request, res: Response, next: NextFunction) => {
    try {
      validator(req.params.contractId, contractIdSchema);
      validator(req.body, updateContractBodySchema);
      const logInUserId = req.user!.userId;
      const contractId = parseInt(req.params.contractId, 10);
      const updateData: UpdateContractDTO = req.body;
      const updatedContract = await contractService.updateContract(
        contractId,
        updateData,
        logInUserId,
      );
      res.status(200).json(updatedContract);
    } catch (error) {
      next(error);
    }
  };

  /**
   * 계약 삭제
   * @param {number} req.user.userId - 로그인한 사용자 ID
   * @param {string} req.params.contractId - 계약 ID
   * @returns 200: {message: '계약 삭제 성공'}
   * @throws {CustomError} 유효성 검사 실패, 존재하지 않는 계약 또는 차량, 권한 없음, DB 트랜잭션 실패
   */
  deleteContract = async (req: Request, res: Response, next: NextFunction) => {
    try {
      validator(req.params.contractId, contractIdSchema);
      const logInUserId = req.user!.userId;
      const contractId = parseInt(req.params.contractId, 10);
      await contractService.deleteContract(contractId, logInUserId);
      res.status(200).json({ message: '계약 삭제 성공' });
    } catch (error) {
      next(error);
    }
  };
}

export default new ContractController();
