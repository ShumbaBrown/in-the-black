import React from 'react';
import { StyleSheet, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { Colors } from '@/src/constants/colors';
import { Typography } from '@/src/constants/typography';
import { TransactionForm } from '@/src/components/transaction/TransactionForm';
import { useTransactions } from '@/src/hooks/useTransactions';
import type { NewTransaction } from '@/src/db/types';

export default function AddScreen() {
  const { create } = useTransactions();
  const router = useRouter();
  const { bookId } = useLocalSearchParams<{ bookId: string }>();

  const handleSubmit = async (transaction: NewTransaction) => {
    await create(transaction);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    router.navigate(`/book/${bookId}`);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Text style={styles.header}>New Entry</Text>
      <TransactionForm onSubmit={handleSubmit} submitLabel="Record Entry" />
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
});
