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
