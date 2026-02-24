import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { Colors } from '@/src/constants/colors';
import { Typography } from '@/src/constants/typography';
import { formatCurrency } from '@/src/utils/currency';

interface Props {
  totalIncome: number;
  totalExpenses: number;
}

export function SummaryCards({ totalIncome, totalExpenses }: Props) {
  return (
    <View style={styles.row}>
      <View style={styles.cardWrapper}>
        <View style={styles.card}>
          <Text style={styles.label}>EARNED</Text>
          <View style={styles.labelRule} />
          <Text style={[styles.amount, { color: Colors.inkBlack }]}>
            {formatCurrency(totalIncome)}
          </Text>
        </View>
      </View>
      <View style={styles.divider} />
      <View style={styles.cardWrapper}>
        <View style={styles.card}>
          <Text style={styles.label}>SPENT</Text>
          <View style={styles.labelRule} />
          <Text style={[styles.amount, { color: Colors.inkRed }]}>
            {formatCurrency(totalExpenses)}
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    marginHorizontal: 16,
    marginTop: 16,
    backgroundColor: Colors.surface,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: Colors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 3,
    elevation: 2,
  },
  cardWrapper: {
    flex: 1,
  },
  card: {
    padding: 16,
  },
  divider: {
    width: 1,
    backgroundColor: Colors.borderHeavy,
    marginVertical: 8,
  },
  label: {
    ...Typography.small,
    color: Colors.textSecondary,
    marginBottom: 4,
  },
  labelRule: {
    height: 1,
    backgroundColor: Colors.border,
    marginBottom: 8,
  },
  amount: {
    ...Typography.amount,
  },
});
