import { Request, Response } from 'express';
import contractDocumentService from '../services/contractDocumentService';
import { uploadContractDocumentValidator } from '../validators/contractDocumentValidator';
import type {
  UploadContractDocumentDTO,
  GetContractDocumentsParamsDTO,
} from '../types/contractDocumentType';
import { validator } from '../validators/utilValidator';
import { getContractDocumentsParamsSchema } from '../validators/contractDocumentValidator';

class ContractDocumentController {
  uploadContractDocument = async (req: Request, res: Response) => {
    // 1. DTO 정의
    const uploadDTO: UploadContractDocumentDTO = {
      fileName: req.file!.filename,
    };

    // 2. 유효성 검사 및 검증된 DTO 반환
    uploadContractDocumentValidator(uploadDTO);

    // 3. service 레이어 호출
    const result = await contractDocumentService.uploadContractDocument(uploadDTO);

    // 4. 결과 반환
    return res.status(200).json(result);
  };

  downloadContractDocument = async (req: Request, res: Response) => {
    // 1. 파라미터 추출
    const contractDocumentId = parseInt(req.params.contractDocumentId);

    // 2. service 레이어 호출
    const document = await contractDocumentService.getContractDocument(contractDocumentId);

    // 3. 파일 다운로드 응답
    const filePath = `document/${document.fileName}`;
    const originalFileName = document.fileName.replace(/_\d{13,}\./, '.'); // 13자리 이상 타임스탬프만 제거

    return res.download(filePath, originalFileName);
  };

  getContractDocumentList = async (req: Request, res: Response) => {
    // 1. 파라미터 검증
    validator(req.query, getContractDocumentsParamsSchema);

    // 2. 파라미터 추출
    const userId = req.user!.userId;
    const params: GetContractDocumentsParamsDTO = {
      page: req.query.page ? parseInt(req.query.page as string, 10) : 1,
      pageSize: req.query.pageSize ? parseInt(req.query.pageSize as string, 10) : 8,
      searchBy: req.query.searchBy as 'contractName' | 'userName' | 'carNumber' | undefined,
      keyword: req.query.keyword as string | undefined,
    };

    // 3. service 레이어 호출
    const result = await contractDocumentService.getContractDocumentList(params, userId);

    // 4. 결과 반환
    return res.status(200).json(result);
  };

  getDraftContractList = async (req: Request, res: Response) => {
    // 1. 사용자 ID 추출
    const userId = req.user!.userId;

    // 2. service 레이어 호출
    const draftContracts = await contractDocumentService.getDraftContractList(userId);

    // 3. 결과 반환
    return res.status(200).json(draftContracts);
  };
}

export default new ContractDocumentController();
