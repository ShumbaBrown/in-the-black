import { useState, useEffect, useCallback } from 'react';
import { useSQLiteContext } from 'expo-sqlite';
import type { Transaction, NewTransaction } from '../db/types';
import { useBook } from '../context/BookContext';
import * as db from '../db/transactions';

export function useTransactions(filter?: 'expense' | 'income') {
  const sqlite = useSQLiteContext();
  const { bookId } = useBook();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    try {
      const data = await db.getAllTransactions(sqlite, bookId, filter);
      setTransactions(data);
    } catch (error) {
      console.error('Failed to fetch transactions:', error);
    } finally {
      setLoading(false);
    }
  }, [sqlite, bookId, filter]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const create = useCallback(
    async (transaction: NewTransaction) => {
      const id = await db.createTransaction(sqlite, bookId, transaction);
      await refresh();
      return id;
    },
    [sqlite, bookId, refresh]
  );

  const update = useCallback(
    async (id: number, transaction: NewTransaction) => {
      await db.updateTransaction(sqlite, id, transaction);
      await refresh();
    },
    [sqlite, refresh]
  );

  const remove = useCallback(
    async (id: number) => {
      await db.deleteTransaction(sqlite, id);
      await refresh();
    },
    [sqlite, refresh]
  );

  const getById = useCallback(
    async (id: number) => {
      return db.getTransactionById(sqlite, id);
    },
    [sqlite]
  );

  return { transactions, loading, refresh, create, update, remove, getById };
}
