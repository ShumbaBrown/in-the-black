import React from 'react';
import { StyleSheet, View, Text, FlatList } from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Colors } from '@/src/constants/colors';
import { Typography } from '@/src/constants/typography';
import { TransactionRow } from '@/src/components/transaction/TransactionRow';
import type { Transaction } from '@/src/db/types';

interface Props {
  transactions: Transaction[];
  onTransactionPress: (transaction: Transaction) => void;
  onTransactionDelete?: (transaction: Transaction) => void;
  ListHeaderComponent?: React.ReactElement;
}

function EmptyState() {
  return (
    <View style={styles.empty}>
      <FontAwesome name="pencil" size={40} color={Colors.textMuted} />
      <Text style={styles.emptyTitle}>No entries yet</Text>
      <Text style={styles.emptyText}>
        Begin recording your finances
      </Text>
    </View>
  );
}

export function TransactionList({
  transactions,
  onTransactionPress,
  onTransactionDelete,
  ListHeaderComponent,
}: Props) {
  return (
    <FlatList
      data={transactions}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item, index }) => (
        <TransactionRow
          transaction={item}
          index={index}
          onPress={onTransactionPress}
          onDelete={onTransactionDelete}
        />
      )}
      ListHeaderComponent={ListHeaderComponent}
      ListEmptyComponent={<EmptyState />}
      contentContainerStyle={styles.list}
      showsVerticalScrollIndicator={false}
    />
  );
}

const styles = StyleSheet.create({
  list: {
    paddingBottom: 100,
  },
  empty: {
    alignItems: 'center',
    paddingTop: 60,
    paddingHorizontal: 40,
  },
  emptyTitle: {
    ...Typography.h3,
    color: Colors.textPrimary,
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    ...Typography.body,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
});
