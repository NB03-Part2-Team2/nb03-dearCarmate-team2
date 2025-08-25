import express from 'express';
import { upload } from '../controllers/uploadController';
import { uploadIamge } from '../middlewares/upload';

const singleUploadRouter = express.Router();

singleUploadRouter.post('/upload', uploadIamge.single('image'), upload);

export default singleUploadRouter;
