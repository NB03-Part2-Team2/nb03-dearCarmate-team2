import * as dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import express, { Express } from 'express';
import { errorHandler } from './middlewares/errorHandler';
import path from 'path';
import singleUploadRouter from './routes/imageUploadRouter';

dotenv.config();

const app: Express = express();

app.use(cors());
app.use(express.json());
app.use(cookieParser());

app.use('/images', singleUploadRouter);
app.use('/images', express.static(path.resolve('public'))); //정적 파일 루트 제공

app.use(errorHandler);

app.listen(process.env.PORT || 3000, () => console.log('Server Starting...'));
