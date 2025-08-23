import * as dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import express, { Express } from 'express';
import contractRouter from './routes/contractRouter';

dotenv.config();

const app: Express = express();

app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use('/api/contracts', contractRouter);

app.listen(process.env.PORT || 3000, () => console.log('Server Starting...'));
