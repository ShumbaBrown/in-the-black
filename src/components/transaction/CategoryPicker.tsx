import React from 'react';
import { StyleSheet, View, Text, Pressable } from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import Animated, { FadeIn } from 'react-native-reanimated';
import { Colors } from '@/src/constants/colors';
import { Typography } from '@/src/constants/typography';
import { useBook } from '@/src/context/BookContext';
import type { CategoryType } from '@/src/constants/categories';

interface Props {
  type: CategoryType;
  selected: string | null;
  onSelect: (categoryId: string) => void;
}

export function CategoryPicker({ type, selected, onSelect }: Props) {
  const { getCategoriesByType } = useBook();
  const categories = getCategoriesByType(type);

  return (
    <Animated.View entering={FadeIn.duration(300)} style={styles.container}>
      <Text style={styles.label}>CATEGORY</Text>
      <View style={styles.grid}>
        {categories.map((category) => (
          <Pressable
            key={category.id}
            style={[
              styles.item,
              selected === category.id && {
                borderColor: category.color,
                backgroundColor: `${category.color}08`,
              },
            ]}
            onPress={() => onSelect(category.id)}
          >
            <View
              style={[
                styles.iconWrap,
                {
                  backgroundColor:
                    selected === category.id
                      ? `${category.color}20`
                      : Colors.surfaceLight,
                },
              ]}
            >
              <FontAwesome
                name={category.icon as any}
                size={18}
                color={
                  selected === category.id
                    ? category.color
                    : Colors.textSecondary
                }
              />
            </View>
            <Text
              style={[
                styles.itemText,
                selected === category.id && { color: Colors.textPrimary },
              ]}
              numberOfLines={1}
            >
              {category.label}
            </Text>
          </Pressable>
        ))}
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
  },
  label: {
    ...Typography.caption,
    color: Colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 12,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  item: {
    width: '30.5%',
    alignItems: 'center',
    padding: 12,
    borderRadius: 2,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  iconWrap: {
    width: 40,
    height: 40,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  itemText: {
    ...Typography.caption,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
});
