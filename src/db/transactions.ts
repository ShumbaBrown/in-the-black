import type { SQLiteDatabase } from 'expo-sqlite';
import type { Transaction, NewTransaction, CategoryBreakdown } from './types';

export async function getAllTransactions(
  db: SQLiteDatabase,
  bookId: number,
  filter?: 'expense' | 'income'
): Promise<Transaction[]> {
  if (filter) {
    return db.getAllAsync<Transaction>(
      'SELECT * FROM transactions WHERE book_id = ? AND type = ? ORDER BY date DESC, created_at DESC',
      [bookId, filter]
    );
  }
  return db.getAllAsync<Transaction>(
    'SELECT * FROM transactions WHERE book_id = ? ORDER BY date DESC, created_at DESC',
    [bookId]
  );
}

export async function getTransactionById(
  db: SQLiteDatabase,
  id: number
): Promise<Transaction | null> {
  return db.getFirstAsync<Transaction>(
    'SELECT * FROM transactions WHERE id = ?',
    [id]
  );
}

export async function createTransaction(
  db: SQLiteDatabase,
  bookId: number,
  transaction: NewTransaction
): Promise<number> {
  const result = await db.runAsync(
    'INSERT INTO transactions (type, amount, description, category, date, book_id) VALUES (?, ?, ?, ?, ?, ?)',
    [
      transaction.type,
      transaction.amount,
      transaction.description,
      transaction.category,
      transaction.date,
      bookId,
    ]
  );
  return result.lastInsertRowId;
}

export async function updateTransaction(
  db: SQLiteDatabase,
  id: number,
  transaction: NewTransaction
): Promise<void> {
  await db.runAsync(
    `UPDATE transactions
     SET type = ?, amount = ?, description = ?, category = ?, date = ?, updated_at = datetime('now')
     WHERE id = ?`,
    [
      transaction.type,
      transaction.amount,
      transaction.description,
      transaction.category,
      transaction.date,
      id,
    ]
  );
}

export async function deleteTransaction(
  db: SQLiteDatabase,
  id: number
): Promise<void> {
  await db.runAsync('DELETE FROM transactions WHERE id = ?', [id]);
}

export async function getTotalIncome(
  db: SQLiteDatabase,
  bookId: number
): Promise<number> {
  const result = await db.getFirstAsync<{ total: number | null }>(
    "SELECT SUM(amount) as total FROM transactions WHERE book_id = ? AND type = 'income'",
    [bookId]
  );
  return result?.total ?? 0;
}

export async function getTotalExpenses(
  db: SQLiteDatabase,
  bookId: number
): Promise<number> {
  const result = await db.getFirstAsync<{ total: number | null }>(
    "SELECT SUM(amount) as total FROM transactions WHERE book_id = ? AND type = 'expense'",
    [bookId]
  );
  return result?.total ?? 0;
}

export async function getCategoryBreakdown(
  db: SQLiteDatabase,
  bookId: number,
  type: 'expense' | 'income',
  period?: 'month'
): Promise<CategoryBreakdown[]> {
  let dateFilter = '';
  if (period === 'month') {
    dateFilter = " AND date >= date('now', 'start of month')";
  }

  const rows = await db.getAllAsync<{ category: string; total: number; count: number }>(
    `SELECT category, SUM(amount) as total, COUNT(*) as count
     FROM transactions
     WHERE book_id = ? AND type = ?${dateFilter}
     GROUP BY category
     ORDER BY total DESC`,
    [bookId, type]
  );

  const grandTotal = rows.reduce((sum, r) => sum + r.total, 0);

  return rows.map((row) => ({
    ...row,
    percentage: grandTotal > 0 ? (row.total / grandTotal) * 100 : 0,
  }));
}

export async function getTotalsForPeriod(
  db: SQLiteDatabase,
  bookId: number,
  period?: 'month'
): Promise<{ totalIncome: number; totalExpenses: number }> {
  let dateFilter = '';
  if (period === 'month') {
    dateFilter = " AND date >= date('now', 'start of month')";
  }

  const income = await db.getFirstAsync<{ total: number | null }>(
    `SELECT SUM(amount) as total FROM transactions WHERE book_id = ? AND type = 'income'${dateFilter}`,
    [bookId]
  );
  const expenses = await db.getFirstAsync<{ total: number | null }>(
    `SELECT SUM(amount) as total FROM transactions WHERE book_id = ? AND type = 'expense'${dateFilter}`,
    [bookId]
  );

  return {
    totalIncome: income?.total ?? 0,
    totalExpenses: expenses?.total ?? 0,
  };
}
