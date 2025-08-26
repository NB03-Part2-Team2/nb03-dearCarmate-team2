import * as dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import express, { Express } from 'express';
import { errorHandler } from './middlewares/errorHandler';
import authRouter from './routes/authRoute';
import contractRouter from './routes/contractRouter';
import path from 'path';
import imageUploadRouter from './routes/imageUploadRoute';
import contractDocumentUploadRouter from './routes/contractDocumentUploadRoute';

dotenv.config();

const app: Express = express();

app.use(cors());
app.use(express.json());
app.use(cookieParser());

app.use('/auth', authRouter);
app.use('/api/contracts', contractRouter);
app.use('/images', imageUploadRouter);
app.use('/images', express.static(path.resolve('public'))); //정적 파일 루트 제공

app.use('/contractDocuments', contractDocumentUploadRouter);
app.use('/contractDocuments', express.static(path.resolve('document')));
app.use(errorHandler);

app.listen(process.env.PORT || 3000, () => console.log('Server Starting...'));
