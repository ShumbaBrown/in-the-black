export interface Transaction {
  id: number;
  type: 'expense' | 'income';
  amount: number;
  description: string;
  category: string;
  date: string;
  book_id: number;
  created_at: string;
  updated_at: string;
}

export interface NewTransaction {
  type: 'expense' | 'income';
  amount: number;
  description: string;
  category: string;
  date: string;
}

export interface Book {
  id: number;
  name: string;
  hobby_template: string | null;
  icon: string;
  color: string;
  created_at: string;
  updated_at: string;
}

export interface NewBook {
  name: string;
  hobby_template: string | null;
  icon: string;
  color: string;
}

export interface BookCategory {
  id: number;
  book_id: number;
  category_id: string;
  label: string;
  icon: string;
  color: string;
  type: 'expense' | 'income';
  sort_order: number;
}

export interface DashboardData {
  totalIncome: number;
  totalExpenses: number;
  netPosition: number;
  recentTransactions: Transaction[];
}

export interface CategoryBreakdown {
  category: string;
  total: number;
  count: number;
  percentage: number;
}
