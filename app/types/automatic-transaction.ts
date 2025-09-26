export enum RecurrenceType {
  DAILY = 'daily',
  WEEKLY = 'weekly',
  MONTHLY = 'monthly',
  YEARLY = 'yearly',
}

export enum AutoTransactionStatus {
  ACTIVE = 'active',
  PAUSED = 'paused',
  COMPLETED = 'completed',
}

export interface AutomaticTransaction {
  _id?: string;
  userId: string;
  amount: number;
  description: string;
  category: string;
  subcategory?: string;
  notes?: string;
  isMandatory: boolean;
  type: 'income' | 'expense';

  // Recurrence settings
  recurrenceType: RecurrenceType;
  recurrenceInterval: number; // e.g., every 2 weeks, every 3 months
  dayOfMonth?: number; // For monthly/yearly (1-31)
  dayOfWeek?: number; // For weekly (0=Sunday, 1=Monday, etc.)

  // Scheduling
  startDate: Date;
  endDate?: Date; // Optional end date
  nextExecutionDate: Date;

  // Status and metadata
  status: AutoTransactionStatus;
  executionCount: number;
  lastExecuted?: Date;

  createdAt?: Date;
  updatedAt?: Date;
}

export interface AutomaticTransactionFormData {
  amount: string;
  description: string;
  category: string;
  subcategory?: string;
  notes?: string;
  isMandatory: boolean;
  type: 'income' | 'expense';

  recurrenceType: RecurrenceType;
  recurrenceInterval: string;
  dayOfMonth?: string;
  dayOfWeek?: string;

  startDate: string;
  endDate?: string;
}

export interface AutoTransactionFilters {
  status?: AutoTransactionStatus;
  type?: 'income' | 'expense';
  category?: string;
  recurrenceType?: RecurrenceType;
}
