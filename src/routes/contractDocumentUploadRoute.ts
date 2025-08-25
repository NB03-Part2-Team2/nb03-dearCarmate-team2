import express from 'express';
import { upload } from '../controllers/contractDocumentUploadController';
import { uploadContractDocument } from '../middlewares/documentUpload';

const contractDocumentUploadRouter = express.Router();

contractDocumentUploadRouter.post('/upload', uploadContractDocument.single('file'), upload);

export default contractDocumentUploadRouter;
