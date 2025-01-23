export interface Expense {
  id: string;
  date: string;
  amount: number;
  category: string;
  description: string;
}

export interface Category {
  id: string;
  name: string;
  color: string;
}

export interface Budget {
  amount: number;
  month: string; // Format: YYYY-MM
}