import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db';
import authRoutes from './routes/authRoutes';
import expenseRoutes from './routes/expenseRoutes';
import { errorHandler } from './middleware/errorHandler';
import { swaggerDocs } from "./config/swagger";

dotenv.config();
connectDB();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

// 👉 Enable Swagger
swaggerDocs(app);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/expenses', expenseRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Expense Tracker API is running' });
});

app.use(errorHandler);

export default app;
