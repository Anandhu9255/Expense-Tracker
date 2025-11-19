import express from 'express';
import {
  getExpenses,
  getExpense,
  createExpense,
  updateExpense,
  deleteExpense,
  getFilteredExpensesByUser,
} from '../controllers/expenseController';
import { getExpenseSummaryByUser } from '../controllers/expenseSummaryController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

// All routes require authentication
router.use(protect);

// @route   GET /api/expenses
router.get('/', getExpenses);

// @route   GET /api/expenses/:id
router.get('/:id', getExpense);

// @route   POST /api/expenses
router.post('/', createExpense);

// @route   PUT /api/expenses/:id
router.put('/:id', updateExpense);

// @route   DELETE /api/expenses/:id
router.delete('/:id', deleteExpense);

// @route   GET /api/expenses/summary/:userId
router.get('/summary/:userId', getExpenseSummaryByUser);

// @route   GET /api/expenses/filter
router.get('/filter', getFilteredExpensesByUser);

export default router;
