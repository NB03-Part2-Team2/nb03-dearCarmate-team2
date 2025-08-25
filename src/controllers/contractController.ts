import { Request, Response } from 'express';
import { createContractDTO } from '../types/contractType';
import contractService from '../services/contractService';

class ContractController {
  getCarsForContract = async (req: Request, res: Response) => {
    const userId = req.user!.userId;
    const cars = await contractService.getCarsInCompany(userId);
    res.status(200).json(cars);
  };

  getCustomersForContract = async (req: Request, res: Response) => {
    const userId = req.user!.userId;
    const customers = await contractService.getCustomersInCompany(userId);
    res.status(200).json(customers);
  };

  getUsersForContract = async (req: Request, res: Response) => {
    const userId = req.user!.userId;
    const users = await contractService.getUsersInCompany(userId);
    res.status(200).json(users);
  };

  createContract = async (req: Request<{}, {}, createContractDTO>, res: Response) => {
    const userId = req.user!.userId;
    const { carId, customerId, meetings } = req.body;
    const contract = await contractService.createContract(userId, carId, customerId, meetings);
    res.status(201).json(contract);
  };
}

export default new ContractController();
