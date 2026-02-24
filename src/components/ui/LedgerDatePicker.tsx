import React, { useCallback } from 'react';
import { StyleSheet, View, Text, Pressable } from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import * as Haptics from 'expo-haptics';
import { Colors } from '@/src/constants/colors';
import { Typography } from '@/src/constants/typography';

const MONTHS = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
];

function daysInMonth(month: number, year: number): number {
  return new Date(year, month + 1, 0).getDate();
}

function clampDate(date: Date, max: Date): Date {
  return date > max ? new Date(max) : date;
}

interface Props {
  value: Date;
  onChange: (date: Date) => void;
  maximumDate?: Date;
}

export function LedgerDatePicker({ value, onChange, maximumDate }: Props) {
  const month = value.getMonth();
  const day = value.getDate();
  const year = value.getFullYear();
  const max = maximumDate ?? new Date();

  const update = useCallback(
    (m: number, d: number, y: number) => {
      // Clamp day to valid range for the month/year
      const maxDay = daysInMonth(m, y);
      const clampedDay = Math.min(d, maxDay);
      const next = new Date(y, m, clampedDay);
      onChange(clampDate(next, max));
      Haptics.selectionAsync();
    },
    [onChange, max]
  );

  const canIncMonth = () => {
    const next = new Date(year, month + 1, Math.min(day, daysInMonth(month + 1, year)));
    return next <= max;
  };

  const canIncDay = () => {
    const next = new Date(year, month, day + 1);
    return next <= max;
  };

  const canIncYear = () => {
    const next = new Date(year + 1, month, Math.min(day, daysInMonth(month, year + 1)));
    return next <= max;
  };

  const incMonth = () => {
    if (!canIncMonth()) return;
    const m = month === 11 ? 0 : month + 1;
    const y = month === 11 ? year + 1 : year;
    update(m, day, y);
  };

  const decMonth = () => {
    const m = month === 0 ? 11 : month - 1;
    const y = month === 0 ? year - 1 : year;
    update(m, day, y);
  };

  const incDay = () => {
    if (!canIncDay()) return;
    const maxDay = daysInMonth(month, year);
    if (day >= maxDay) {
      // Wrap to next month
      incMonth();
      update(month === 11 ? 0 : month + 1, 1, month === 11 ? year + 1 : year);
    } else {
      update(month, day + 1, year);
    }
  };

  const decDay = () => {
    if (day <= 1) {
      // Wrap to previous month's last day
      const prevMonth = month === 0 ? 11 : month - 1;
      const prevYear = month === 0 ? year - 1 : year;
      update(prevMonth, daysInMonth(prevMonth, prevYear), prevYear);
    } else {
      update(month, day - 1, year);
    }
  };

  const incYear = () => {
    if (!canIncYear()) return;
    update(month, day, year + 1);
  };

  const decYear = () => {
    update(month, day, year - 1);
  };

  return (
    <View style={styles.container}>
      <View style={styles.columns}>
        <Column
          label="Month"
          value={MONTHS[month]}
          onInc={incMonth}
          onDec={decMonth}
          canInc={canIncMonth()}
          flex={1.2}
        />
        <View style={styles.divider} />
        <Column
          label="Day"
          value={String(day)}
          onInc={incDay}
          onDec={decDay}
          canInc={canIncDay()}
          flex={0.8}
        />
        <View style={styles.divider} />
        <Column
          label="Year"
          value={String(year)}
          onInc={incYear}
          onDec={decYear}
          canInc={canIncYear()}
          flex={1}
        />
      </View>
    </View>
  );
}

interface ColumnProps {
  label: string;
  value: string;
  onInc: () => void;
  onDec: () => void;
  canInc: boolean;
  flex: number;
}

function Column({ label, value, onInc, onDec, canInc, flex }: ColumnProps) {
  return (
    <View style={[styles.column, { flex }]}>
      <Pressable
        onPress={onInc}
        style={({ pressed }) => [styles.arrow, { opacity: pressed ? 0.5 : canInc ? 1 : 0.25 }]}
        hitSlop={8}
        disabled={!canInc}
      >
        <FontAwesome name="chevron-up" size={12} color={Colors.textSecondary} />
      </Pressable>
      <Text style={styles.value}>{value}</Text>
      <Pressable
        onPress={onDec}
        style={({ pressed }) => [styles.arrow, { opacity: pressed ? 0.5 : 1 }]}
        hitSlop={8}
      >
        <FontAwesome name="chevron-down" size={12} color={Colors.textSecondary} />
      </Pressable>
      <Text style={styles.columnLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 8,
  },
  columns: {
    flexDirection: 'row',
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    borderBottomWidth: 2,
    borderBottomColor: Colors.borderHeavy,
    borderRadius: 2,
  },
  column: {
    alignItems: 'center',
    paddingVertical: 10,
  },
  divider: {
    width: 1,
    backgroundColor: Colors.borderHeavy,
    marginVertical: 8,
  },
  arrow: {
    padding: 6,
  },
  value: {
    ...Typography.amount,
    color: Colors.textPrimary,
    textAlign: 'center',
    marginVertical: 2,
  },
  columnLabel: {
    ...Typography.caption,
    color: Colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginTop: 4,
  },
});
