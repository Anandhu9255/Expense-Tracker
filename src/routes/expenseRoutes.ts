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

/**
 * @swagger
 * tags:
 *   name: Expenses
 *   description: Expense CRUD endpoints
 */

router.use(protect);

/**
 * @swagger
 * /api/expenses:
 *   get:
 *     summary: Get all expenses for the logged-in user
 *     tags: [Expenses]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of expenses
 */
router.get('/', getExpenses);

/**
 * @swagger
 * /api/expenses/{id}:
 *   get:
 *     summary: Get a single expense by ID
 *     tags: [Expenses]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *     responses:
 *       200:
 *         description: Expense details
 *       404:
 *         description: Not found
 */
router.get('/:id', getExpense);

/**
 * @swagger
 * /api/expenses:
 *   post:
 *     summary: Create a new expense
 *     tags: [Expenses]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateExpenseRequest'
 *     responses:
 *       201:
 *         description: Expense created
 *       400:
 *         description: Validation error
 */
router.post('/', createExpense);

/**
 * @swagger
 * /api/expenses/{id}:
 *   put:
 *     summary: Update an expense by ID
 *     tags: [Expenses]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateExpenseRequest'
 *     responses:
 *       200:
 *         description: Updated expense
 *       404:
 *         description: Expense not found
 */
router.put('/:id', updateExpense);

/**
 * @swagger
 * /api/expenses/{id}:
 *   delete:
 *     summary: Delete an expense
 *     tags: [Expenses]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *     responses:
 *       200:
 *         description: Deleted successfully
 *       404:
 *         description: Expense not found
 */
router.delete('/:id', deleteExpense);

/**
 * @swagger
 * /api/expenses/summary/{userId}:
 *   get:
 *     summary: Get monthly expense summary for a user
 *     tags: [Expenses]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *     responses:
 *       200:
 *         description: Summary data
 */
router.get('/summary/:userId', getExpenseSummaryByUser);

/**
 * @swagger
 * /api/expenses/filter:
 *   get:
 *     summary: Filter expenses for logged-in user
 *     tags: [Expenses]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: category
 *       - in: query
 *         name: minAmount
 *       - in: query
 *         name: maxAmount
 *       - in: query
 *         name: search
 *     responses:
 *       200:
 *         description: Filtered expenses
 */
router.get('/filter', getFilteredExpensesByUser);

export default router;
