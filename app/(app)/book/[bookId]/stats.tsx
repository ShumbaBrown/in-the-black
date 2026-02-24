import React, { useState, useCallback } from 'react';
import { StyleSheet, Text, ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import { Colors } from '@/src/constants/colors';
import { Typography } from '@/src/constants/typography';
import { useBook } from '@/src/context/BookContext';
import { SegmentedToggle } from '@/src/components/ui/SegmentedToggle';
import { BreakdownChart } from '@/src/components/stats/BreakdownChart';
import { SummaryCards } from '@/src/components/dashboard/SummaryCards';
import { getCategoryBreakdown, getTotalsForPeriod } from '@/src/db/transactions';
import type { CategoryBreakdown } from '@/src/db/types';

export default function StatsScreen() {
  const db = useSQLiteContext();
  const { bookId } = useBook();
  const [periodIndex, setPeriodIndex] = useState(0);
  const period = periodIndex === 0 ? ('month' as const) : undefined;

  const [expenseBreakdown, setExpenseBreakdown] = useState<CategoryBreakdown[]>([]);
  const [incomeBreakdown, setIncomeBreakdown] = useState<CategoryBreakdown[]>([]);
  const [totals, setTotals] = useState({ totalIncome: 0, totalExpenses: 0 });

  const refresh = useCallback(async () => {
    const [expenses, income, t] = await Promise.all([
      getCategoryBreakdown(db, bookId, 'expense', period),
      getCategoryBreakdown(db, bookId, 'income', period),
      getTotalsForPeriod(db, bookId, period),
    ]);
    setExpenseBreakdown(expenses);
    setIncomeBreakdown(income);
    setTotals(t);
  }, [db, bookId, period]);

  useFocusEffect(
    useCallback(() => {
      refresh();
    }, [refresh])
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Text style={styles.header}>Ledger Summary</Text>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.toggleWrapper}>
          <SegmentedToggle
            options={['This Month', 'All Time']}
            selected={periodIndex}
            onSelect={setPeriodIndex}
          />
        </View>
        <SummaryCards
          totalIncome={totals.totalIncome}
          totalExpenses={totals.totalExpenses}
        />
        <View style={styles.charts}>
          <BreakdownChart data={expenseBreakdown} type="expense" />
          <BreakdownChart data={incomeBreakdown} type="income" />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    ...Typography.h1,
    color: Colors.textPrimary,
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 4,
  },
  content: {
    paddingBottom: 100,
  },
  toggleWrapper: {
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  charts: {
    paddingHorizontal: 16,
    paddingTop: 20,
  },
});
