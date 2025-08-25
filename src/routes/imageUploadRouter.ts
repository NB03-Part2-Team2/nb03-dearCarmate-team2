import express from 'express';
import { upload } from '../controllers/uploadController';
import { uploadIamge } from '../middlewares/upload';

const imageUploadRouter = express.Router();

imageUploadRouter.post('/upload', uploadIamge.single('image'), upload);

export default imageUploadRouter;
