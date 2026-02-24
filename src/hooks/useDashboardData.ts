import { useState, useEffect, useCallback } from 'react';
import { useSQLiteContext } from 'expo-sqlite';
import type { Transaction } from '../db/types';
import { useBook } from '../context/BookContext';
import * as db from '../db/transactions';

interface DashboardData {
  totalIncome: number;
  totalExpenses: number;
  netPosition: number;
  transactions: Transaction[];
  loading: boolean;
}

export function useDashboardData(filter?: 'expense' | 'income') {
  const sqlite = useSQLiteContext();
  const { bookId } = useBook();
  const [data, setData] = useState<DashboardData>({
    totalIncome: 0,
    totalExpenses: 0,
    netPosition: 0,
    transactions: [],
    loading: true,
  });

  const refresh = useCallback(async () => {
    try {
      const [totalIncome, totalExpenses, transactions] = await Promise.all([
        db.getTotalIncome(sqlite, bookId),
        db.getTotalExpenses(sqlite, bookId),
        db.getAllTransactions(sqlite, bookId, filter),
      ]);

      setData({
        totalIncome,
        totalExpenses,
        netPosition: totalIncome - totalExpenses,
        transactions,
        loading: false,
      });
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
      setData((prev) => ({ ...prev, loading: false }));
    }
  }, [sqlite, bookId, filter]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { ...data, refresh };
}
