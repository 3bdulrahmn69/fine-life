import mongoose from 'mongoose';
import { TransactionType } from '../types/transaction';

const transactionSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
      index: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      required: true,
    },
    subcategory: {
      type: String,
      required: false,
    },
    notes: {
      type: String,
      required: false,
      trim: true,
    },
    isMandatory: {
      type: Boolean,
      default: false,
    },
    isAutomatic: {
      type: Boolean,
      default: false,
    },
    type: {
      type: String,
      enum: Object.values(TransactionType),
      required: true,
    },
    date: {
      type: Date,
      required: true,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

// Create compound index for efficient queries
transactionSchema.index({ userId: 1, date: -1 });
transactionSchema.index({ userId: 1, category: 1 });
transactionSchema.index({ userId: 1, type: 1 });

const Transaction =
  mongoose.models.Transaction ||
  mongoose.model('Transaction', transactionSchema);

export default Transaction;
