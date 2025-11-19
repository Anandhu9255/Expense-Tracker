import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import Expense from '../models/expenseModel';

// Extend Request interface to include user
declare global {
  namespace Express {
    interface Request {
      user?: { _id: string };
    }
  }
}

// Validation schemas
const createExpenseSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100, 'Title too long'),
  amount: z.number().positive('Amount must be positive'),
  category: z.enum(['Food', 'Transportation', 'Entertainment', 'Bills', 'Shopping', 'Healthcare', 'Education', 'Other']),
  description: z.string().max(500, 'Description too long').optional(),
  date: z.string().datetime().optional(),
});

const updateExpenseSchema = createExpenseSchema.partial();

// @desc    Get all expenses for logged in user
// @route   GET /api/expenses
// @access  Private
export const getExpenses = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const expenses = await Expense.find({ user: req.user!._id }).sort({ date: -1 });
    res.json(expenses);
  } catch (error) {
    next(error);
  }
};

// @desc    Get single expense
// @route   GET /api/expenses/:id
// @access  Private
export const getExpense = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const expense = await Expense.findById(req.params.id);

    if (!expense) {
      res.status(404).json({ message: 'Expense not found' });
      return;
    }

    // Check if expense belongs to user
    if (expense.user.toString() !== req.user!._id) {
      res.status(401).json({ message: 'Not authorized' });
      return;
    }

    res.json(expense);
  } catch (error) {
    next(error);
  }
};

// @desc    Create new expense
// @route   POST /api/expenses
// @access  Private
export const createExpense = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { title, amount, category, description, date } = createExpenseSchema.parse(req.body);

    const expense = await Expense.create({
      user: req.user!._id,
      title,
      amount,
      category,
      description,
      date: date ? new Date(date) : new Date(),
    });

    res.status(201).json({
      message: 'Expense created successfully',
      expense,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ message: 'Validation error', errors: error.errors });
    } else {
      next(error);
    }
  }
};

// @desc    Update expense
// @route   PUT /api/expenses/:id
// @access  Private
export const updateExpense = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const expense = await Expense.findById(req.params.id);

    if (!expense) {
      res.status(404).json({ message: 'Expense not found' });
      return;
    }

    // Check if expense belongs to user
    if (expense.user.toString() !== req.user!._id) {
      res.status(401).json({ message: 'Not authorized' });
      return;
    }

    const { title, amount, category, description, date } = updateExpenseSchema.parse(req.body);

    const updatedExpense = await Expense.findByIdAndUpdate(
      req.params.id,
      {
        title: title || expense.title,
        amount: amount || expense.amount,
        category: category || expense.category,
        description: description !== undefined ? description : expense.description,
        date: date ? new Date(date) : expense.date,
      },
      { new: true }
    );

    res.json({
      message: 'Expense updated successfully',
      expense: updatedExpense,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ message: 'Validation error', errors: error.errors });
    } else {
      next(error);
    }
  }
};

// @desc    Delete expense
// @route   DELETE /api/expenses/:id
// @access  Private
export const deleteExpense = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const expense = await Expense.findById(req.params.id);

    if (!expense) {
      res.status(404).json({ message: 'Expense not found' });
      return;
    }

    // Check if expense belongs to user
    if (expense.user.toString() !== req.user!._id) {
      res.status(401).json({ message: 'Not authorized' });
      return;
    }

    await Expense.findByIdAndDelete(req.params.id);

    res.json({ message: 'Expense deleted successfully' });
  } catch (error) {
    next(error);
  }
};

// @desc    Get filtered expenses by user
// @route   GET /api/expenses/filter
// @access  Private
export const getFilteredExpensesByUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = req.user?._id;
    if (!userId) {
      res.status(401).json({ message: 'User not authenticated' });
      return;
    }

    const { category, minAmount, maxAmount, search } = req.query;

    const query: any = { user: userId };

    if (category) query.category = category;
    if (minAmount || maxAmount) {
      query.amount = {};
      if (minAmount) query.amount.$gte = Number(minAmount);
      if (maxAmount) query.amount.$lte = Number(maxAmount);
    }
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const expenses = await Expense.find(query).sort({ date: -1 });

    if (!expenses.length) {
      res.status(404).json({ message: 'No expenses found for this filter.' });
      return;
    }

    res.json(expenses);
  } catch (error) {
    next(error);
  }
};
