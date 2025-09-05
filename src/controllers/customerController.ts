import { Request, Response, NextFunction } from 'express';
import customerService from '../services/customerService';
import { CreateCustomerDTO, SearchParamListDTO } from '../types/customerType';
import { CustomError } from '../utils/customErrorUtil';
import { validator } from '../validators/utilValidator';
import {
  createCustomerSchema,
  getCustomerListParamsSchema,
  customerIdSchema,
  updateCustomerSchema,
} from '../validators/customerValidator';

class CustomerController {
  /**
   * 새로운 고객 생성
   * @param {number} req.user.userId - 로그인한 사용자 ID
   * @param {CreateCustomerDTO} req.body - 고객 생성 데이터
   * @param {string} req.body.name - 고객 이름
   * @param {string} req.body.gender - 성별 ('male' | 'female')
   * @param {string} req.body.phoneNumber - 전화번호
   * @param {string} req.body.email - 이메일
   * @param {string} [req.body.memo] - 메모
   * @param {string} [req.body.ageGroup] - 연령대
   * @param {string} [req.body.region] - 지역
   * @returns 201: 생성된 고객 객체
   * @throws {CustomError} 유효성 검사 실패, DB 에러
   */
  createCustomer = async (req: Request, res: Response, next: NextFunction) => {
    try {
      validator(req.body, createCustomerSchema);
      const userId = req.user!.userId;
      const customerData = req.body;
      const result = await customerService.createCustomer(customerData, userId);
      res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  };

  /**
   * 고객 목록 조회 (페이지네이션 및 검색 지원)
   * @param {number} req.user.userId - 로그인한 사용자 ID
   * @param {string} [req.query.searchBy] - 검색 기준 ('name' | 'email')
   * @param {string} [req.query.keyword] - 검색 키워드
   * @param {string} [req.query.page] - 페이지 번호 (기본값: 1)
   * @param {string} [req.query.pageSize] - 페이지당 항목 수 (기본값: 8)
   * @returns 200: {
   *   currentPage: number,
   *   totalPages: number,
   *   totalItemCount: number,
   *   data: Customer[]
   * }
   * @throws {CustomError} 유효성 검사 실패, 유효하지 않은 searchBy 값, DB 에러
   */
  getCustomerList = async (req: Request, res: Response, next: NextFunction) => {
    try {
      validator(req.query, getCustomerListParamsSchema);
      const userId = req.user!.userId;
      const searchParams: SearchParamListDTO = {
        searchBy: req.query.searchBy as 'name' | 'email' | undefined,
        keyword: req.query.keyword as string | undefined,
        page: parseInt(req.query.page as string, 10) || 1,
        pageSize: parseInt(req.query.pageSize as string, 10) || 8,
      };
      const result = await customerService.getCustomerList(userId, searchParams);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };

  /**
   * 기존 고객 정보 수정
   * @param {string} req.params.customerId - 고객 ID
   * @param {CreateCustomerDTO} req.body - 업데이트할 고객 정보
   * @returns 200: 수정된 고객 객체
   * @throws {CustomError} 유효성 검사 실패, 존재하지 않는 고객 (P2025 에러), DB 에러
   */
  updateCustomer = async (req: Request, res: Response, next: NextFunction) => {
    try {
      validator(req.params.customerId, customerIdSchema);
      validator(req.body, updateCustomerSchema);
      const customerId = parseInt(req.params.customerId, 10);
      const customerData = req.body;
      const result = await customerService.updateCustomer(customerId, customerData);
      res.status(200).json(result);
    } catch (error: any) {
      if (error.name === 'PrismaClientKnownRequestError' && (error as any).code === 'P2025') {
        throw CustomError.notFound('존재하지 않는 고객입니다.');
      } else {
        next(error);
      }
    }
  };

  /**
   * 고객 삭제
   * @param {string} req.params.customerId - 고객 ID
   * @returns 200: {message: '고객 삭제 성공'}
   * @throws {CustomError} 유효성 검사 실패, 존재하지 않는 고객 (P2025 에러), 계약이 존재하는 고객
   */
  deleteCustomer = async (req: Request, res: Response, next: NextFunction) => {
    try {
      validator(req.params.customerId, customerIdSchema);
      const customerId = parseInt(req.params.customerId, 10);
      await customerService.deleteCustomer(customerId);
      res.status(200).json({ message: '고객 삭제 성공' });
    } catch (error: any) {
      if (error.name === 'PrismaClientKnownRequestError' && (error as any).code === 'P2025') {
        throw CustomError.notFound('존재하지 않는 고객입니다.');
      } else {
        next(error);
      }
    }
  };

  /**
   * 특정 고객 상세 정보 조회
   * @param {string} req.params.customerId - 고객 ID
   * @returns 200: 고객 상세 정보 객체 (계약 수 포함)
   * @throws {CustomError} 유효성 검사 실패, 존재하지 않는 고객, DB 에러
   */
  getCustomer = async (req: Request, res: Response, next: NextFunction) => {
    try {
      validator(req.params.customerId, customerIdSchema);
      const customerId = parseInt(req.params.customerId, 10);
      const result = await customerService.getCustomer(customerId);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };

  /**
   * 대량 고객 등록 (CSV/Excel 업로드 등)
   * @param {number} req.user.userId - 로그인한 사용자 ID
   * @param {any[]} req.parsedData - 파싱된 고객 데이터 배열
   * @returns 200: {message: '성공적으로 등록되었습니다'}
   * @throws {CustomError} 유효한 고객 데이터가 없거나 필수 필드 누락 (이름, 성별, 전화번호, 이메일), DB 에러
   */
  createManyCustomerList = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user!.userId;
      const parsedData = req.parsedData;
      if (!parsedData || parsedData.length === 0) {
        throw CustomError.badRequest('유효한 고객 데이터가 없습니다.');
      }
      const mapToCustomerDTO = (
        data: Record<string, string | number | boolean | null>,
      ): CreateCustomerDTO => {
        if (
          typeof data.name !== 'string' ||
          (data.gender !== 'male' && data.gender !== 'female') ||
          typeof data.phoneNumber !== 'string' ||
          typeof data.email !== 'string'
        ) {
          // 필수 필드가 누락되었거나 타입이 잘못된 경우 즉시 에러를 던집니다.
          throw CustomError.badRequest();
        }
        return {
          name: data.name,
          gender: data.gender as 'male' | 'female',
          phoneNumber: data.phoneNumber,
          email: data.email,
          memo: data.memo as string | undefined,
          ageGroup: data.ageGroup as string | undefined,
          region: data.region as string | undefined,
        } as CreateCustomerDTO;
      };
      const customers: CreateCustomerDTO[] = [];
      // 1. 파싱된 데이터를 DTO 배열로 변환
      for (const item of parsedData) {
        const dto = mapToCustomerDTO(item);
        customers.push(dto);
      }
      // 2. 변환된 DTO 배열을 서비스에 전달
      await customerService.createManyCustomerList(customers, userId);
      res.status(200).json({ message: '성공적으로 등록되었습니다' });
    } catch (error) {
      next(error);
    }
  };
}

export default new CustomerController();
