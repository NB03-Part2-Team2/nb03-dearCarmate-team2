import { Request, Response } from 'express';
import contractDocumentService from '../services/contractDocumentService';
import { uploadContractDocumentValidator } from '../validators/contractDocumentValidator';
import type { UploadContractDocumentDTO } from '../types/contractDocumentType';

class ContractDocumentController {
  uploadContractDocument = async (req: Request, res: Response) => {
    // 1. DTO 정의
    const uploadDTO: UploadContractDocumentDTO = {
      fileName: req.file!.filename,
    };

    // 2. 유효성 검사 및 검증된 DTO 반환
    const validatedDTO = uploadContractDocumentValidator(uploadDTO);

    // 3. service 레이어 호출
    const result = await contractDocumentService.uploadContractDocument(validatedDTO);

    // 4. 결과 반환
    return res.status(200).json(result);
  };
}

export default new ContractDocumentController();
