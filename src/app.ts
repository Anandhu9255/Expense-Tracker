import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db';
import authRoutes from './routes/authRoutes';
import expenseRoutes from './routes/expenseRoutes';
import { errorHandler } from './middleware/errorHandler';

// Load environment variables
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// CORS
app.use(cors());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/expenses', expenseRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Expense Tracker API is running' });
});

// Error handler (must be last)
app.use(errorHandler);

export default app;
