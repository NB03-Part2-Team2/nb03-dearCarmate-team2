import { Request, Response, NextFunction } from 'express';
import { createContractDTO, UpdateContractDTO } from '../types/contractType';
import contractService from '../services/contractService';

class ContractController {
  getCarsForContract = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user!.userId;
      const cars = await contractService.getCarsInCompany(userId);
      res.status(200).json(cars);
    } catch (error) {
      next(error);
    }
  };

  getCustomersForContract = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user!.userId;
      const customers = await contractService.getCustomersInCompany(userId);
      res.status(200).json(customers);
    } catch (error) {
      next(error);
    }
  };

  getUsersForContract = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user!.userId;
      const users = await contractService.getUsersInCompany(userId);
      res.status(200).json(users);
    } catch (error) {
      next(error);
    }
  };

  createContract = async (
    req: Request<{}, {}, createContractDTO>,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const userId = req.user!.userId;
      const { carId, customerId, meetings } = req.body;
      const contract = await contractService.createContract(userId, carId, customerId, meetings);
      res.status(201).json(contract);
    } catch (error) {
      next(error);
    }
  };

  getContractsInCompany = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user!.userId;
      const searchBy = req.query.searchBy as string | undefined;
      const keyword = req.query.keyword as string | undefined;
      const contracts = await contractService.getContractListInCompany(userId, searchBy, keyword);
      res.status(200).json(contracts);
    } catch (error) {
      next(error);
    }
  };

  updateContract = async (req: Request, res: Response, next: NextFunction) => {
    try {
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

  deleteContract = async (req: Request, res: Response, next: NextFunction) => {
    try {
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
