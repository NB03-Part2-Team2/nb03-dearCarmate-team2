import contractRepository from "../repositories/contractRepository";

class ContractService {
  getCarsInCompany = async (userId) => {
    const companyId = await contractRepository.getCompanyId(userId)
    const cars = await contractRepository.getCars(companyId)
    return cars
  }

}

export default new ContractService()