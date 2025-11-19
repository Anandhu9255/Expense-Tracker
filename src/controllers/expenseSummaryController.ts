import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import Expense from '../models/expenseModel';

// Extend Request interface to include user
declare global {
  namespace Express {
    interface Request {
      user?: { _id: string };
    }
  }
}

// Helper function to generate monthly suggestion
function generateMonthlySuggestion(categories: Record<string, number>, topCategory: string, total: number): string {
  if (total === 0) return 'No expenses this month. Great job!';

  const topAmount = categories[topCategory] || 0;
  const topPercentage = (topAmount / total) * 100;

  if (topPercentage > 50) {
    if (topCategory === 'Food') {
      return 'Consider tracking small food expenses — they add up quickly!';
    } else if (topCategory === 'Entertainment') {
      return 'Entertainment spending is high. Maybe try some free activities?';
    } else if (topCategory === 'Shopping') {
      return 'Shopping expenses are dominating. Review if all purchases were necessary.';
    } else {
      return `Your ${topCategory.toLowerCase()} spending is over 50% of total expenses. Consider reducing it.`;
    }
  } else if (topPercentage > 30) {
    return `You are doing well managing your expenses this month. Keep it up!`;
  } else {
    return 'Excellent expense management this month!';
  }
}

// Helper function to generate overall suggestion
function generateOverallSuggestion(categories: Record<string, number>, topCategory: string): string {
  if (Object.keys(categories).length === 0) return 'No expenses found. Start tracking to get insights!';

  const total = Object.values(categories).reduce((sum, amount) => sum + amount, 0);
  const topAmount = categories[topCategory] || 0;
  const topPercentage = (topAmount / total) * 100;

  if (topPercentage > 40) {
    if (topCategory === 'Food') {
      return 'Food is your biggest expense category. Try meal planning to reduce costs.';
    } else if (topCategory === 'Bills') {
      return 'Bills are high. Review subscriptions and utilities for savings.';
    } else if (topCategory === 'Transportation') {
      return 'Transportation costs are significant. Consider carpooling or public transport.';
    } else {
      return `${topCategory} is your top spending category. Look for ways to optimize.`;
    }
  } else {
    return 'Your spending is well-balanced across categories. Good job!';
  }
}

// @desc    Get advanced expense summary by user
// @route   GET /api/expenses/summary/:userId
// @access  Private
export const getExpenseSummaryByUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { userId } = req.params;

    // Validate userId
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      res.status(400).json({ message: 'Invalid user ID' });
      return;
    }

    // Fetch all expenses for the user
    const expenses = await Expense.find({ user: userId }).sort({ date: -1 });

    if (expenses.length === 0) {
      res.status(404).json({ message: 'No expenses found for this user' });
      return;
    }

    // Group expenses by month and category
    const monthlyData: Record<string, { total: number; categories: Record<string, number>; expenses: any[] }> = {};

    expenses.forEach(expense => {
      const date = new Date(expense.date);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;

      if (!monthlyData[monthKey]) {
        monthlyData[monthKey] = { total: 0, categories: {}, expenses: [] };
      }

      monthlyData[monthKey].total += expense.amount;
      if (!monthlyData[monthKey].categories[expense.category]) {
        monthlyData[monthKey].categories[expense.category] = 0;
      }
      monthlyData[monthKey].categories[expense.category] += expense.amount;
      monthlyData[monthKey].expenses.push(expense);
    });

    // Calculate overall totals and top category
    const overallCategories: Record<string, number> = {};
    let overallTotal = 0;

    Object.values(monthlyData).forEach(month => {
      overallTotal += month.total;
      Object.entries(month.categories).forEach(([cat, amount]) => {
        if (!overallCategories[cat]) overallCategories[cat] = 0;
        overallCategories[cat] += amount;
      });
    });

    const topCategory = Object.entries(overallCategories).reduce((a, b) => overallCategories[a[0]] > overallCategories[b[0]] ? a : b)[0];

    // Build monthly summary
    const monthlySummary = Object.entries(monthlyData)
      .sort(([a], [b]) => b.localeCompare(a)) // Sort by month descending
      .map(([month, data]) => {
        const monthTopCategory = Object.entries(data.categories).reduce((a, b) => data.categories[a[0]] > data.categories[b[0]] ? a : b)[0];
        return {
          month,
          total: parseFloat(data.total.toFixed(2)),
          categories: Object.fromEntries(
            Object.entries(data.categories).map(([cat, amt]) => [cat, parseFloat(amt.toFixed(2))])
          ),
          suggestion: generateMonthlySuggestion(data.categories, monthTopCategory, data.total)
        };
      });

    // Response
    res.json({
      userId,
      total: parseFloat(overallTotal.toFixed(2)),
      monthlySummary,
      topCategory,
      overallSuggestion: generateOverallSuggestion(overallCategories, topCategory)
    });
  } catch (error) {
    next(error);
  }
};
