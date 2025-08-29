import * as dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import express, { Express } from 'express';
import { errorHandler } from './middlewares/errorHandler';
import authRouter from './routes/authRoute';
import userRouter from './routes/userRoute';
import contractRouter from './routes/contractRoute';
import customerRouter from './routes/customerRoute';
import path from 'path';
import imageUploadRouter from './routes/imageUploadRoute';
import contractDocumentRouter from './routes/contractDocumentRoute';
import carRouter from './routes/carRoute';

dotenv.config();

const app: Express = express();

app.use(cors());
app.use(express.json());
app.use(cookieParser());

app.use('/auth', authRouter);
app.use('/users', userRouter);
app.use('/customers', customerRouter);
app.use('/contracts', contractRouter);
app.use('/cars', carRouter);

app.use('/images', imageUploadRouter);
app.use('/images', express.static(path.resolve('public'))); //정적 파일 루트 제공
app.use('/contractDocuments', contractDocumentRouter);
app.use('/contractDocuments', express.static(path.resolve('document')));

app.use(errorHandler);

app.listen(process.env.PORT || 3000, () => console.log('Server Starting...'));
