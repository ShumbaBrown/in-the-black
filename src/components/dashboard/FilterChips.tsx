import React from 'react';
import { StyleSheet, View, Pressable, Text } from 'react-native';
import { Colors } from '@/src/constants/colors';
import { Typography } from '@/src/constants/typography';

export type FilterOption = 'all' | 'expense' | 'income';

interface Props {
  selected: FilterOption;
  onSelect: (filter: FilterOption) => void;
}

const FILTERS: { key: FilterOption; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'expense', label: 'Expenses' },
  { key: 'income', label: 'Income' },
];

export function FilterChips({ selected, onSelect }: Props) {
  return (
    <View style={styles.container}>
      {FILTERS.map(({ key, label }) => (
        <Pressable
          key={key}
          style={[styles.chip, selected === key && styles.chipActive]}
          onPress={() => onSelect(key)}
        >
          <Text
            style={[styles.chipText, selected === key && styles.chipTextActive]}
          >
            {label}
          </Text>
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginTop: 20,
    marginBottom: 12,
    gap: 8,
  },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 2,
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  chipActive: {
    backgroundColor: Colors.inkBlue,
    borderColor: Colors.inkBlue,
  },
  chipText: {
    ...Typography.caption,
    color: Colors.textSecondary,
  },
  chipTextActive: {
    color: '#FFFDF7',
  },
});
