import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import dotenv from 'dotenv';
import userRoute from './routes/user.route.js';
import todoRoute from './routes/todo.route.js';

dotenv.config();
const app = express();
app.use(helmet());
app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/v1/auth', userRoute);
app.use('/api/v1', todoRoute);

// Global error handling

export default app;
