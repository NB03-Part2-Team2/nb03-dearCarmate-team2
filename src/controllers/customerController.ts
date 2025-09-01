import { Request, Response, NextFunction } from 'express';
import customerService from '../services/customerService';
import { SearchParamListDTO } from '../types/customerType';

class CustomerController {
  createCustomer = async (req: Request, res: Response, next: NextFunction) => {
    try {
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
      const userId = req.user!.userId;
      const searchParams: SearchParamListDTO = {
        searchBy: req.query.searchBy as 'name' | 'email' | undefined,
        keyword: req.query.keyword as string | undefined,
        page: Number(req.query.page) || 1,
        pageSize: Number(req.query.pageSize) || 8,
      };
      const result = await customerService.getCustomerList(userId, searchParams);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };

  updateCustomer = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const customerId = parseInt(req.params.customerId, 10);
      const customerData = req.body;
      const result = await customerService.updateCustomer(customerId, customerData);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };

  deleteCustomer = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const customerId = parseInt(req.params.customerId, 10);
      await customerService.deleteCustomer(customerId);
      res.status(200).json({ message: '고객 삭제 성공' });
    } catch (error) {
      next(error);
    }
  };

  getCustomer = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const customerId = parseInt(req.params.customerId, 10);
      const result = await customerService.getCustomer(customerId);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };
}

export default new CustomerController();
