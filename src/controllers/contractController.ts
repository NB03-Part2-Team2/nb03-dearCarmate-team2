import { Request, Response, NextFunction } from "express"
import contractService from "../services/contractService";

class ContractController {
  getCarsForContract = async (req: Request, res: Response) => {
    const { userId } = req.user!.userId
    const cars = await contractService.getCarsInCompany(userId)
    res.status(200).json(cars)
  }
}

export default new ContractController()