import express from 'express';
import { upload } from '../controllers/imageUploadController';
import { uploadIamge } from '../middlewares/imageUpload';

const imageUploadRouter = express.Router();

imageUploadRouter.post('/upload', uploadIamge.single('image'), upload);

export default imageUploadRouter;
