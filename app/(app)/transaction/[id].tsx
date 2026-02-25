import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, ActivityIndicator, View, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import * as Haptics from 'expo-haptics';
import { Colors } from '@/src/constants/colors';
import { Typography } from '@/src/constants/typography';
import { TransactionForm } from '@/src/components/transaction/TransactionForm';
import { BookProvider } from '@/src/context/BookContext';
import { getTransactionById, updateTransaction, deleteTransaction } from '@/src/db/transactions';
import type { Transaction, NewTransaction } from '@/src/db/types';
import { useAuth } from '@/src/context/AuthContext';
import * as sync from '@/src/services/syncService';
import { captureSyncError } from '@/src/utils/captureSync';

function EditTransactionContent({ transaction }: { transaction: Transaction }) {
  const router = useRouter();
  const db = useSQLiteContext();
  const { user } = useAuth();

  const handleSubmit = async (values: NewTransaction) => {
    await updateTransaction(db, transaction.id, values);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

    if (user) {
      sync.pushTransaction(db, user.id, transaction.id).catch(captureSyncError('pushTransaction'));
    }

    router.back();
  };

  const handleDelete = async () => {
    const serverId = transaction.server_id;
    await deleteTransaction(db, transaction.id);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);

    if (user && serverId) {
      sync.pushDeleteTransaction(serverId).catch(captureSyncError('pushDeleteTransaction'));
    }

    router.back();
  };

  return (
    <TransactionForm
      initialValues={{
        type: transaction.type,
        amount: transaction.amount,
        description: transaction.description,
        category: transaction.category,
        date: transaction.date,
      }}
      onSubmit={handleSubmit}
      onDelete={handleDelete}
      submitLabel="Save Changes"
    />
  );
}

export default function EditTransactionScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const db = useSQLiteContext();
  const router = useRouter();
  const [transaction, setTransaction] = useState<Transaction | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      if (id) {
        const t = await getTransactionById(db, parseInt(id, 10));
        setTransaction(t);
      }
      setLoading(false);
    };
    load();
  }, [id, db]);

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator color={Colors.inkBlue} size="large" />
      </SafeAreaView>
    );
  }

  if (!transaction) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.errorText}>Transaction not found</Text>
      </SafeAreaView>
    );
  }

  return (
    <BookProvider bookId={transaction.book_id}>
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.headerRow}>
          <Pressable onPress={() => router.back()} style={styles.backButton}>
            <FontAwesome name="chevron-down" size={18} color={Colors.textSecondary} />
          </Pressable>
          <Text style={styles.header}>Amend Entry</Text>
          <View style={styles.backButton} />
        </View>
        <EditTransactionContent transaction={transaction} />
      </SafeAreaView>
    </BookProvider>
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
    paddingTop: 12,
    paddingBottom: 4,
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    ...Typography.h2,
    color: Colors.textPrimary,
    textAlign: 'center',
  },
  errorText: {
    ...Typography.body,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginTop: 40,
  },
});
