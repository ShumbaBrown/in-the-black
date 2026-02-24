import { useState, useEffect, useCallback } from 'react';
import { useSQLiteContext } from 'expo-sqlite';
import type { Transaction, NewTransaction } from '../db/types';
import { useBook } from '../context/BookContext';
import { useAuth } from '../context/AuthContext';
import * as db from '../db/transactions';
import * as sync from '../services/syncService';

export function useTransactions(filter?: 'expense' | 'income') {
  const sqlite = useSQLiteContext();
  const { bookId } = useBook();
  const { user } = useAuth();
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

      if (user) {
        sync.pushTransaction(sqlite, user.id, id).catch((e) =>
          console.warn('Sync pushTransaction failed:', e)
        );
      }

      return id;
    },
    [sqlite, bookId, refresh, user]
  );

  const update = useCallback(
    async (id: number, transaction: NewTransaction) => {
      await db.updateTransaction(sqlite, id, transaction);
      await refresh();

      if (user) {
        sync.pushTransaction(sqlite, user.id, id).catch((e) =>
          console.warn('Sync pushTransaction failed:', e)
        );
      }
    },
    [sqlite, refresh, user]
  );

  const remove = useCallback(
    async (id: number) => {
      // Grab server_id before local delete
      const tx = await db.getTransactionById(sqlite, id);
      const serverId = tx?.server_id ?? null;

      await db.deleteTransaction(sqlite, id);
      await refresh();

      if (user && serverId) {
        sync.pushDeleteTransaction(serverId).catch((e) =>
          console.warn('Sync pushDeleteTransaction failed:', e)
        );
      }
    },
    [sqlite, refresh, user]
  );

  const getById = useCallback(
    async (id: number) => {
      return db.getTransactionById(sqlite, id);
    },
    [sqlite]
  );

  return { transactions, loading, refresh, create, update, remove, getById };
}
