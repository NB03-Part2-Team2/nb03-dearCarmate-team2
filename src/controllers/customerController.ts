import { Request, Response, NextFunction } from 'express';
import customerService from '../services/customerService';

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
}

export default new CustomerController();
