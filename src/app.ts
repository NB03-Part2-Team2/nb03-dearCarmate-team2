import * as dotenv from 'dotenv'
import cors from 'cors';
import cookieParser from 'cookie-parser'
import express, { Express } from 'express';

dotenv.config()

const app: Express = express();

app.use(cors());
app.use(express.json());
app.use(cookieParser())

app.listen(process.env.PORT || 3000, () => console.log("Server Starting..."));