import mongoose, { Document, Schema } from 'mongoose';

export interface IExpense extends Document {
  user: mongoose.Types.ObjectId;
  title: string;
  amount: number;
  category: string;
  description?: string;
  date: Date;
  createdAt: Date;
  updatedAt: Date;
}

const expenseSchema: Schema<IExpense> = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Expense must belong to a user'],
    },
    title: {
      type: String,
      required: [true, 'Please add a title'],
      trim: true,
      maxlength: [100, 'Title cannot be more than 100 characters'],
    },
    amount: {
      type: Number,
      required: [true, 'Please add an amount'],
      min: [0, 'Amount must be positive'],
    },
    category: {
      type: String,
      required: [true, 'Please add a category'],
      enum: {
        values: ['Food', 'Transportation', 'Entertainment', 'Bills', 'Shopping', 'Healthcare', 'Education', 'Other'],
        message: 'Category must be one of: Food, Transportation, Entertainment, Bills, Shopping, Healthcare, Education, Other',
      },
    },
    description: {
      type: String,
      maxlength: [500, 'Description cannot be more than 500 characters'],
    },
    date: {
      type: Date,
      required: [true, 'Please add a date'],
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Index for better query performance
expenseSchema.index({ user: 1, date: -1 });

const Expense = mongoose.model<IExpense>('Expense', expenseSchema);

export default Expense;
