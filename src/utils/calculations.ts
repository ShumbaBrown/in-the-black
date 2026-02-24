import type { Transaction } from '../db/types';

export function calculateNetPosition(
  totalIncome: number,
  totalExpenses: number
): number {
  return totalIncome - totalExpenses;
}

export function isInTheBlack(netPosition: number): boolean {
  return netPosition >= 0;
}

export function groupTransactionsByDate(
  transactions: Transaction[]
): Map<string, Transaction[]> {
  const grouped = new Map<string, Transaction[]>();
  for (const t of transactions) {
    const existing = grouped.get(t.date) ?? [];
    existing.push(t);
    grouped.set(t.date, existing);
  }
  return grouped;
}
