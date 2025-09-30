import mongoose from 'mongoose';

const budgetSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      required: false,
      trim: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 0.01,
    },
    currency: {
      type: String,
      required: true,
      default: 'USD',
      trim: true,
      uppercase: true,
      minlength: 3,
      maxlength: 3,
    },
    month: {
      type: Number,
      required: true,
      min: 1,
      max: 12,
    },
    year: {
      type: Number,
      required: true,
      min: 2000,
    },
    isOverall: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Create compound indices for efficient queries
budgetSchema.index({ userId: 1, month: 1, year: 1 });
budgetSchema.index({ userId: 1, isOverall: 1, month: 1, year: 1 });

// Ensure only one overall budget per user per month/year
budgetSchema.index(
  { userId: 1, month: 1, year: 1, isOverall: 1 },
  {
    unique: true,
    partialFilterExpression: { isOverall: true },
  }
);

// Ensure only one budget per category per user per month/year
budgetSchema.index(
  { userId: 1, category: 1, month: 1, year: 1 },
  {
    unique: true,
    partialFilterExpression: { isOverall: false, category: { $exists: true } },
  }
);

const Budget = mongoose.models.Budget || mongoose.model('Budget', budgetSchema);

export default Budget;
