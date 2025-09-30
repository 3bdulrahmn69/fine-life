export interface Budget {
  _id?: string;
  userId: string;
  name: string;
  category?: string; // undefined for overall budget
  amount: number;
  currency: string;
  month: number; // 1-12
  year: number;
  isOverall: boolean; // true for overall budget, false for category budget
  createdAt?: Date;
  updatedAt?: Date;
}

export interface BudgetFormData {
  name: string;
  category?: string;
  amount: string;
  currency: string;
  isOverall: boolean;
}

export interface BudgetWithSpending extends Budget {
  spent: number;
  remaining: number;
  percentage: number;
  isOverBudget: boolean;
}

export interface BudgetStats {
  totalBudget: number;
  totalSpent: number;
  totalRemaining: number;
  overallPercentage: number;
  categoryBudgets: BudgetWithSpending[];
  overallBudget?: BudgetWithSpending;
}

export interface BudgetFilters {
  category?: string;
  isOverall?: boolean;
  month?: number;
  year?: number;
}
