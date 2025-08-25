import express from 'express';
import { upload } from '../controllers/uploadController';
import { uploadContractDocument } from '../middlewares/imageUpload';

const contractDocumentUploadRouter = express.Router();

contractDocumentUploadRouter.post('/upload', uploadContractDocument.single('file'), upload);

export default contractDocumentUploadRouter;
