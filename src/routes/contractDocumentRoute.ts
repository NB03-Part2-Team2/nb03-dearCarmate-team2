import express from 'express';
import contractDocumentController from '../controllers/contractDocumentController';
import { uploadContractDocument } from '../middlewares/contractDocumentUpload';
import auth from '../middlewares/auth';

const contractDocumentRouter = express.Router();

// 인증 미들웨어 적용
contractDocumentRouter.use(auth.verifyAccessToken);
contractDocumentRouter.use(auth.verifyUserAuth);

// 계약서 업로드 (POST /contractDocuments/upload)
contractDocumentRouter
  .route('/upload')
  .post(uploadContractDocument.single('file'), contractDocumentController.uploadContractDocument);

// 계약서 다운로드 (GET /contractDocuments/:contractDocumentId/download)
contractDocumentRouter
  .route('/:contractDocumentId/download')
  .get(contractDocumentController.downloadContractDocument);

// 계약서 목록 조회 (GET /contractDocuments)
contractDocumentRouter.route('/').get(contractDocumentController.getContractDocumentList);

export default contractDocumentRouter;
