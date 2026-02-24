import React from 'react';
import { StyleSheet, View, Text, Pressable, Alert } from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Swipeable } from 'react-native-gesture-handler';
import * as Haptics from 'expo-haptics';
import { Colors } from '@/src/constants/colors';
import { Typography } from '@/src/constants/typography';
import { formatCurrency } from '@/src/utils/currency';
import { formatDateShort } from '@/src/utils/dates';
import { useBook } from '@/src/context/BookContext';
import type { Transaction } from '@/src/db/types';

interface Props {
  transaction: Transaction;
  index: number;
  onPress: (transaction: Transaction) => void;
  onDelete?: (transaction: Transaction) => void;
}

function DeleteAction() {
  return (
    <View style={styles.deleteAction}>
      <FontAwesome name="trash" size={20} color="#FFFDF7" />
    </View>
  );
}

export function TransactionRow({ transaction, index, onPress, onDelete }: Props) {
  const { getCategoryById } = useBook();
  const category = getCategoryById(transaction.category);
  const isIncome = transaction.type === 'income';

  const handleSwipeOpen = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    Alert.alert(
      'Delete Transaction',
      `Delete "${transaction.description}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => onDelete?.(transaction),
        },
      ]
    );
  };

  return (
    <Animated.View entering={FadeInDown.delay(Math.min(index, 10) * 50).springify()}>
      <Swipeable
        renderRightActions={onDelete ? DeleteAction : undefined}
        onSwipeableOpen={handleSwipeOpen}
        overshootRight={false}
      >
        <Pressable
          style={({ pressed }) => [styles.row, { opacity: pressed ? 0.7 : 1 }]}
          onPress={() => onPress(transaction)}
        >
          <Text style={styles.date}>{formatDateShort(transaction.date)}</Text>
          <View
            style={[
              styles.iconContainer,
              { backgroundColor: category?.color ? `${category.color}15` : Colors.surfaceLight },
            ]}
          >
            <FontAwesome
              name={(category?.icon as any) ?? 'circle'}
              size={16}
              color={category?.color ?? Colors.textSecondary}
            />
          </View>
          <View style={styles.details}>
            <Text style={styles.description} numberOfLines={1}>
              {transaction.description}
            </Text>
            <Text style={styles.meta}>
              {category?.label ?? transaction.category}
            </Text>
          </View>
          <Text
            style={[
              styles.amount,
              { color: isIncome ? Colors.inkBlack : Colors.inkRed },
            ]}
          >
            {isIncome ? '+' : '-'}
            {formatCurrency(transaction.amount)}
          </Text>
        </Pressable>
      </Swipeable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: Colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.ruledLine,
    marginHorizontal: 16,
  },
  date: {
    ...Typography.caption,
    color: Colors.textMuted,
    width: 48,
    marginRight: 8,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  details: {
    flex: 1,
    marginLeft: 10,
  },
  description: {
    ...Typography.body,
    color: Colors.textPrimary,
  },
  meta: {
    ...Typography.caption,
    color: Colors.textSecondary,
    marginTop: 1,
  },
  amount: {
    ...Typography.bodyBold,
    marginLeft: 8,
  },
  deleteAction: {
    backgroundColor: Colors.inkRed,
    justifyContent: 'center',
    alignItems: 'center',
    width: 80,
    marginRight: 16,
  },
});
