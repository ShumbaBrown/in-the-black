import React, { useState, useCallback } from 'react';
import { StyleSheet, View, Text, Pressable } from 'react-native';
import { useFocusEffect, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSQLiteContext } from 'expo-sqlite';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import * as Haptics from 'expo-haptics';
import { Colors } from '@/src/constants/colors';
import { Typography } from '@/src/constants/typography';
import { useBook } from '@/src/context/BookContext';
import { useDashboardData } from '@/src/hooks/useDashboardData';
import { NetPositionHero } from '@/src/components/dashboard/NetPositionHero';
import { SummaryCards } from '@/src/components/dashboard/SummaryCards';
import { FilterChips, type FilterOption } from '@/src/components/dashboard/FilterChips';
import { TransactionList } from '@/src/components/dashboard/TransactionList';
import { deleteTransaction, getTransactionById } from '@/src/db/transactions';
import type { Transaction } from '@/src/db/types';
import { useAuth } from '@/src/context/AuthContext';
import * as sync from '@/src/services/syncService';
import { captureSyncError } from '@/src/utils/captureSync';

export default function DashboardScreen() {
  const { book } = useBook();
  const { user } = useAuth();
  const [filter, setFilter] = useState<FilterOption>('all');
  const dbFilter = filter === 'all' ? undefined : filter;
  const { totalIncome, totalExpenses, netPosition, transactions, loading, refresh } =
    useDashboardData(dbFilter);
  const router = useRouter();
  const db = useSQLiteContext();

  useFocusEffect(
    useCallback(() => {
      refresh();
    }, [refresh])
  );

  const handleTransactionPress = (transaction: Transaction) => {
    router.push(`/transaction/${transaction.id}`);
  };

  const handleTransactionDelete = async (transaction: Transaction) => {
    const serverId = transaction.server_id;
    await deleteTransaction(db, transaction.id);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    refresh();

    if (user && serverId) {
      sync.pushDeleteTransaction(serverId).catch(captureSyncError('pushDeleteTransaction'));
    }
  };

  const handleBookPress = () => {
    router.push('/');
  };

  const ListHeader = (
    <View>
      <NetPositionHero netPosition={netPosition} />
      <SummaryCards totalIncome={totalIncome} totalExpenses={totalExpenses} />
      <FilterChips selected={filter} onSelect={setFilter} />
      <Text style={styles.sectionTitle}>Recent Transactions</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.headerRow}>
        <Pressable style={styles.headerLeft} onPress={handleBookPress}>
          <FontAwesome
            name={book.icon as any}
            size={20}
            color={book.color}
            style={styles.headerIcon}
          />
          <Text style={styles.header} numberOfLines={1}>
            {book.name}
          </Text>
          <FontAwesome
            name="chevron-down"
            size={14}
            color={Colors.textSecondary}
            style={styles.chevron}
          />
        </Pressable>
        <Pressable
          onPress={() => router.push(`/book/${book.id}/categories`)}
          style={styles.settingsButton}
          hitSlop={12}
        >
          <FontAwesome name="cog" size={18} color={Colors.textSecondary} />
        </Pressable>
      </View>
      <TransactionList
        transactions={transactions}
        onTransactionPress={handleTransactionPress}
        onTransactionDelete={handleTransactionDelete}
        ListHeaderComponent={ListHeader}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 4,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  headerIcon: {
    marginRight: 10,
  },
  header: {
    ...Typography.h1,
    color: Colors.textPrimary,
    flex: 1,
  },
  chevron: {
    marginLeft: 8,
  },
  settingsButton: {
    padding: 8,
    marginLeft: 8,
  },
  sectionTitle: {
    ...Typography.caption,
    color: Colors.textSecondary,
    paddingHorizontal: 16,
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
});
