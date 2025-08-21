import { Request, Response, NextFunction } from "express"

class ContractController {
  getCarsForContract = async (req: Request, res: Response) => {
    const { userId } = req.user!.userId
    const cars = await ContractService.getCarsInCompany(userId)
    res.status(200).json(cars)
  }
}