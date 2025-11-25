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

// ✅ FIXED CORS (Render + Local)
app.use(cors({
  origin: [
    "http://localhost:3000",
    "https://expense-tracker-twkk.onrender.com"
  ],
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Swagger
swaggerDocs(app);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/expenses', expenseRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Expense Tracker API is running' });
});

// Global Error Handler
app.use(errorHandler);

export default app;
