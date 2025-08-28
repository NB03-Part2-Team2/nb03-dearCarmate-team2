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
}

export default new CustomerController();
