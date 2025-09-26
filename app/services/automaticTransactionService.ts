import connectDB from '../lib/mongodb';
import AutomaticTransaction from '../models/AutomaticTransaction';
import Transaction from '../models/Transaction';
import {
  AutoTransactionStatus,
  RecurrenceType,
} from '../types/automatic-transaction';
import { addDays, addWeeks, addMonths, addYears } from 'date-fns';

export class AutomaticTransactionService {
  /**
   * Normalize a date to midnight (00:00:00) in local timezone
   * This ensures all automatic transactions execute at midnight
   */
  static normalizeDateToMidnight(date: Date): Date {
    const normalized = new Date(date);
    normalized.setHours(0, 0, 0, 0);
    return normalized;
  }

  /**
   * Create a date from date string and normalize to midnight
   */
  static createMidnightDate(dateString: string): Date {
    const date = new Date(dateString + 'T00:00:00');
    return this.normalizeDateToMidnight(date);
  }
  /**
   * Process all active automatic transactions that are due for execution
   */
  static async processAutomaticTransactions(): Promise<{
    processed: number;
    errors: string[];
  }> {
    let processed = 0;
    const errors: string[] = [];

    try {
      await connectDB();

      // Find all active automatic transactions that are due
      // Compare with current date normalized to midnight
      const now = this.normalizeDateToMidnight(new Date());
      const dueTransactions = await AutomaticTransaction.find({
        status: AutoTransactionStatus.ACTIVE,
        nextExecutionDate: { $lte: now },
      });

      console.log(
        `Found ${dueTransactions.length} automatic transactions due for execution`
      );

      for (const autoTransaction of dueTransactions) {
        try {
          console.log(
            `[CRON] Processing automatic transaction: ${autoTransaction._id} (${autoTransaction.description})`
          );

          // Create the actual transaction
          const newTransaction = new Transaction({
            userId: autoTransaction.userId,
            amount: autoTransaction.amount,
            description: autoTransaction.description,
            category: autoTransaction.category,
            subcategory: autoTransaction.subcategory,
            type: autoTransaction.type,
            date: this.normalizeDateToMidnight(new Date()), // Ensure consistent date handling
            notes: autoTransaction.notes
              ? `${autoTransaction.notes} (Auto-generated)`
              : 'Auto-generated transaction',
            isMandatory: autoTransaction.isMandatory,
            isAutomatic: true,
            automaticTransactionId: autoTransaction._id,
          });

          await newTransaction.save();
          console.log(
            `[CRON] Created transaction: ${newTransaction._id} for amount: ${autoTransaction.amount}`
          );

          // Calculate next execution date (always normalized to midnight)
          const nextExecutionDate = this.normalizeDateToMidnight(
            this.calculateNextExecutionDate(
              autoTransaction.nextExecutionDate,
              autoTransaction.recurrenceType,
              autoTransaction.recurrenceInterval || 1,
              autoTransaction.dayOfMonth,
              autoTransaction.dayOfWeek
            )
          );

          // Check if transaction has reached its end date
          if (
            autoTransaction.endDate &&
            nextExecutionDate > autoTransaction.endDate
          ) {
            // Mark as completed - transaction has reached its end date
            await AutomaticTransaction.findByIdAndUpdate(autoTransaction._id, {
              status: AutoTransactionStatus.COMPLETED,
              lastExecuted: new Date(),
              $inc: { executionCount: 1 },
            });
            console.log(
              `[CRON] Automatic transaction ${autoTransaction._id} completed (reached end date)`
            );
          } else {
            // Update the automatic transaction with next execution date
            await AutomaticTransaction.findByIdAndUpdate(autoTransaction._id, {
              nextExecutionDate,
              lastExecuted: new Date(),
              $inc: { executionCount: 1 },
            });
            console.log(
              `[CRON] Next execution for ${
                autoTransaction._id
              }: ${nextExecutionDate.toISOString()}`
            );
          }

          processed++;
          console.log(
            `[CRON] ✓ Successfully processed automatic transaction: ${autoTransaction.description} (${autoTransaction._id})`
          );
        } catch (error) {
          const errorMessage = `Failed to process automatic transaction ${
            autoTransaction._id
          } (${autoTransaction.description}): ${
            error instanceof Error ? error.message : 'Unknown error'
          }`;
          console.error(`[CRON] ✗ ${errorMessage}`);
          errors.push(errorMessage);

          // Continue processing other transactions even if one fails
          continue;
        }
      }

      console.log(
        `[CRON] Processing complete. Processed: ${processed}, Errors: ${errors.length}`
      );
      return { processed, errors };
    } catch (error) {
      const errorMessage = `Fatal error processing automatic transactions: ${
        error instanceof Error ? error.message : 'Unknown error'
      }`;
      console.error(`[CRON] ${errorMessage}`);
      return { processed, errors: [errorMessage] };
    }
  }

  /**
   * Calculate the next execution date based on recurrence settings
   */
  static calculateNextExecutionDate(
    currentDate: Date,
    recurrenceType: RecurrenceType,
    interval: number = 1,
    dayOfMonth?: number,
    dayOfWeek?: number
  ): Date {
    // Normalize the current date to midnight before calculations
    const current = this.normalizeDateToMidnight(new Date(currentDate));

    switch (recurrenceType) {
      case RecurrenceType.DAILY:
        return addDays(current, interval);

      case RecurrenceType.WEEKLY:
        // For weekly recurrence with specific day of week
        if (dayOfWeek !== undefined && dayOfWeek !== null) {
          const nextWeek = addWeeks(current, interval);
          const currentDayOfWeek = nextWeek.getDay();
          const daysDiff = (dayOfWeek - currentDayOfWeek + 7) % 7;
          return addDays(nextWeek, daysDiff);
        }
        // Default weekly increment
        return addWeeks(current, interval);

      case RecurrenceType.MONTHLY:
        const nextMonth = addMonths(current, interval);

        // If dayOfMonth is specified, set it
        if (dayOfMonth && dayOfMonth >= 1 && dayOfMonth <= 31) {
          // Handle end of month edge cases
          const lastDayOfMonth = new Date(
            nextMonth.getFullYear(),
            nextMonth.getMonth() + 1,
            0
          ).getDate();
          const targetDay = Math.min(dayOfMonth, lastDayOfMonth);
          nextMonth.setDate(targetDay);
        }

        return nextMonth;

      case RecurrenceType.YEARLY:
        const nextYear = addYears(current, interval);

        if (dayOfMonth && dayOfMonth >= 1 && dayOfMonth <= 31) {
          // Handle leap year edge case for Feb 29
          const lastDayOfMonth = new Date(
            nextYear.getFullYear(),
            nextYear.getMonth() + 1,
            0
          ).getDate();
          const targetDay = Math.min(dayOfMonth, lastDayOfMonth);
          nextYear.setDate(targetDay);
        }

        return nextYear;

      default:
        // Fallback to daily
        return addDays(current, 1);
    }
  }

  /**
   * Calculate the initial next execution date for a new automatic transaction
   */
  static calculateInitialNextExecutionDate(
    startDate: Date,
    recurrenceType: RecurrenceType,
    interval: number = 1,
    dayOfMonth?: number,
    dayOfWeek?: number
  ): Date {
    // Normalize both dates to midnight for consistent comparison
    const start = this.normalizeDateToMidnight(new Date(startDate));
    const now = this.normalizeDateToMidnight(new Date());

    // If start date is in the future, use it as the first execution
    if (start > now) {
      return start;
    }

    // For current or past start dates, calculate the next execution from now
    const baseDate = this.normalizeDateToMidnight(new Date(now));

    // For daily transactions, simply add the interval to today
    if (recurrenceType === RecurrenceType.DAILY) {
      return this.normalizeDateToMidnight(addDays(baseDate, interval));
    }

    // For weekly transactions, find the next occurrence
    if (recurrenceType === RecurrenceType.WEEKLY) {
      if (dayOfWeek !== undefined && dayOfWeek !== null) {
        const currentDayOfWeek = baseDate.getDay();
        const daysUntilTarget = (dayOfWeek - currentDayOfWeek + 7) % 7;

        if (daysUntilTarget === 0) {
          // If it's the same day of week, schedule for next week
          return this.normalizeDateToMidnight(addDays(baseDate, 7 * interval));
        } else {
          // Schedule for the next occurrence of that day
          return this.normalizeDateToMidnight(
            addDays(baseDate, daysUntilTarget)
          );
        }
      } else {
        // Default to next week if no day specified
        return this.normalizeDateToMidnight(addWeeks(baseDate, interval));
      }
    }

    // For monthly and yearly, calculate the next occurrence
    let nextExecution = new Date(baseDate);

    if (recurrenceType === RecurrenceType.MONTHLY) {
      nextExecution = addMonths(baseDate, interval);

      if (dayOfMonth && dayOfMonth >= 1 && dayOfMonth <= 31) {
        const lastDayOfMonth = new Date(
          nextExecution.getFullYear(),
          nextExecution.getMonth() + 1,
          0
        ).getDate();
        const targetDay = Math.min(dayOfMonth, lastDayOfMonth);
        nextExecution.setDate(targetDay);
      }
    } else if (recurrenceType === RecurrenceType.YEARLY) {
      nextExecution = addYears(baseDate, interval);

      if (dayOfMonth && dayOfMonth >= 1 && dayOfMonth <= 31) {
        const lastDayOfMonth = new Date(
          nextExecution.getFullYear(),
          nextExecution.getMonth() + 1,
          0
        ).getDate();
        const targetDay = Math.min(dayOfMonth, lastDayOfMonth);
        nextExecution.setDate(targetDay);
      }
    }

    return this.normalizeDateToMidnight(nextExecution);
  }

  /**
   * Validate automatic transaction recurrence settings
   */
  static validateRecurrenceSettings(
    recurrenceType: RecurrenceType,
    dayOfMonth?: number,
    dayOfWeek?: number
  ): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    // Validate day of month for monthly/yearly
    if (
      [RecurrenceType.MONTHLY, RecurrenceType.YEARLY].includes(recurrenceType)
    ) {
      if (dayOfMonth !== undefined && (dayOfMonth < 1 || dayOfMonth > 31)) {
        errors.push('Day of month must be between 1 and 31');
      }
    }

    // Validate day of week for weekly
    if (recurrenceType === RecurrenceType.WEEKLY) {
      if (dayOfWeek !== undefined && (dayOfWeek < 0 || dayOfWeek > 6)) {
        errors.push('Day of week must be between 0 (Sunday) and 6 (Saturday)');
      }
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }
}
