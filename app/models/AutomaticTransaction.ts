import mongoose from 'mongoose';
import {
  RecurrenceType,
  AutoTransactionStatus,
} from '../types/automatic-transaction';

const automaticTransactionSchema = new mongoose.Schema(
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
      required: true,
      default: 'USD',
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
    type: {
      type: String,
      enum: ['income', 'expense'],
      required: true,
    },

    // Recurrence settings
    recurrenceType: {
      type: String,
      enum: Object.values(RecurrenceType),
      required: true,
    },
    recurrenceInterval: {
      type: Number,
      required: true,
      min: 1,
    },
    dayOfMonth: {
      type: Number,
      min: 1,
      max: 31,
      required: false,
    },
    dayOfWeek: {
      type: Number,
      min: 0,
      max: 6,
      required: false,
    },

    // Scheduling
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: false,
    },
    nextExecutionDate: {
      type: Date,
      required: true,
      index: true,
    },

    // Status and metadata
    status: {
      type: String,
      enum: Object.values(AutoTransactionStatus),
      default: AutoTransactionStatus.ACTIVE,
    },
    executionCount: {
      type: Number,
      default: 0,
    },
    lastExecuted: {
      type: Date,
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

// Create compound indices for efficient queries
automaticTransactionSchema.index({ userId: 1, status: 1 });
automaticTransactionSchema.index({ userId: 1, nextExecutionDate: 1 });
automaticTransactionSchema.index({ nextExecutionDate: 1, status: 1 });

const AutomaticTransaction =
  mongoose.models.AutomaticTransaction ||
  mongoose.model('AutomaticTransaction', automaticTransactionSchema);

export default AutomaticTransaction;
