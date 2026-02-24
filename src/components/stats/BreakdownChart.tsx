import React, { useEffect } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  FadeInDown,
} from 'react-native-reanimated';
import { Colors } from '@/src/constants/colors';
import { Typography } from '@/src/constants/typography';
import { formatCurrency } from '@/src/utils/currency';
import { useBook } from '@/src/context/BookContext';
import type { CategoryBreakdown } from '@/src/db/types';

interface Props {
  data: CategoryBreakdown[];
  type: 'expense' | 'income';
}

function BarRow({
  item,
  index,
  maxPercentage,
}: {
  item: CategoryBreakdown;
  index: number;
  maxPercentage: number;
}) {
  const { getCategoryById } = useBook();
  const category = getCategoryById(item.category);
  const barWidth = useSharedValue(0);

  useEffect(() => {
    const targetWidth = maxPercentage > 0 ? (item.percentage / maxPercentage) * 100 : 0;
    barWidth.value = withSpring(targetWidth, {
      damping: 15,
      stiffness: 80,
      mass: 0.8,
    });
  }, [item.percentage, maxPercentage, barWidth]);

  const barStyle = useAnimatedStyle(() => ({
    width: `${barWidth.value}%` as unknown as number,
  }));

  return (
    <Animated.View
      entering={FadeInDown.delay(index * 80).springify()}
      style={styles.barRow}
    >
      <View style={styles.barLabel}>
        <View
          style={[
            styles.iconDot,
            { backgroundColor: category?.color ?? Colors.textMuted },
          ]}
        >
          <FontAwesome
            name={(category?.icon as any) ?? 'circle'}
            size={12}
            color="#FFFDF7"
          />
        </View>
        <Text style={styles.categoryName} numberOfLines={1}>
          {category?.label ?? item.category}
        </Text>
        <Text style={styles.barAmount}>{formatCurrency(item.total)}</Text>
      </View>
      <View style={styles.barTrack}>
        <Animated.View
          style={[
            styles.barFill,
            { backgroundColor: category?.color ?? Colors.inkBlue },
            barStyle,
          ]}
        />
      </View>
    </Animated.View>
  );
}

export function BreakdownChart({ data, type }: Props) {
  const maxPercentage = Math.max(...data.map((d) => d.percentage), 1);
  const total = data.reduce((sum, d) => sum + d.total, 0);

  if (data.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>
          No {type === 'expense' ? 'expenses' : 'income'} recorded
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>
          {type === 'expense' ? 'Expense' : 'Income'} Breakdown
        </Text>
        <Text
          style={[
            styles.total,
            {
              color:
                type === 'expense' ? Colors.inkRed : Colors.inkBlack,
            },
          ]}
        >
          {formatCurrency(total)}
        </Text>
      </View>
      <View style={styles.headerRule} />
      {data.map((item, index) => (
        <BarRow
          key={item.category}
          item={item}
          index={index}
          maxPercentage={maxPercentage}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.surface,
    borderRadius: 2,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 3,
    elevation: 2,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  headerRule: {
    height: 2,
    backgroundColor: Colors.borderHeavy,
    marginBottom: 16,
  },
  title: {
    ...Typography.h3,
    color: Colors.textPrimary,
  },
  total: {
    ...Typography.bodyBold,
  },
  barRow: {
    marginBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: Colors.ruledLine,
    paddingBottom: 14,
  },
  barLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  iconDot: {
    width: 26,
    height: 26,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  categoryName: {
    ...Typography.body,
    color: Colors.textPrimary,
    flex: 1,
  },
  barAmount: {
    ...Typography.caption,
    color: Colors.textSecondary,
    marginLeft: 8,
  },
  barTrack: {
    height: 8,
    backgroundColor: Colors.surfaceLight,
    borderRadius: 1,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    borderRadius: 1,
    minWidth: 4,
  },
  emptyContainer: {
    backgroundColor: Colors.surface,
    borderRadius: 2,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 32,
    marginBottom: 16,
    alignItems: 'center',
  },
  emptyText: {
    ...Typography.body,
    color: Colors.textSecondary,
  },
});
