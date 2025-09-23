export interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
  type: TransactionType;
  subcategories?: Subcategory[];
}

export interface Subcategory {
  id: string;
  name: string;
  parentId: string;
}

export enum TransactionType {
  INCOME = 'income',
  EXPENSE = 'expense',
}

export interface Transaction {
  _id?: string;
  userId: string;
  amount: number;
  description: string;
  category: string;
  subcategory?: string;
  notes?: string;
  isMandatory: boolean;
  isAutomatic: boolean;
  type: TransactionType;
  date: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface TransactionFormData {
  amount: string;
  description: string;
  category: string;
  subcategory?: string;
  notes?: string;
  isMandatory: boolean;
  isAutomatic: boolean;
  type: TransactionType;
  date: string;
}

export interface MonthlyTransactions {
  month: string;
  year: number;
  transactions: Transaction[];
  totalIncome: number;
  totalExpenses: number;
  balance: number;
}

export interface TransactionFilters {
  type?: TransactionType;
  category?: string;
  startDate?: Date;
  endDate?: Date;
  isMandatory?: boolean;
  isAutomatic?: boolean;
}

export interface TransactionStats {
  totalIncome: number;
  totalExpenses: number;
  balance: number;
  transactionCount: number;
  categoriesBreakdown: {
    category: string;
    amount: number;
    percentage: number;
  }[];
}
