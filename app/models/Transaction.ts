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
    currency: {
      type: String,
      required: [true, 'Currency is required'],
      default: 'USD',
      trim: true,
      uppercase: true,
      minlength: [3, 'Currency code must be 3 characters'],
      maxlength: [3, 'Currency code must be 3 characters'],
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
    automaticTransactionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'AutomaticTransaction',
      required: false,
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
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
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
