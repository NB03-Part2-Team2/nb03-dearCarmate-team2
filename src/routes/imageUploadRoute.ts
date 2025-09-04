import express from 'express';
import imageController from '../controllers/imageUploadController';
import { uploadImage } from '../middlewares/imageUpload';

const imageUploadRouter = express.Router();

imageUploadRouter.post('/upload', uploadImage.single('file'), imageController.upload);

export default imageUploadRouter;
