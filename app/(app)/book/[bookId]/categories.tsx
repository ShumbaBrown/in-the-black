import React, { useState, useCallback, useEffect } from 'react';
import { StyleSheet, View, Text, Pressable, Alert, SectionList } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSQLiteContext } from 'expo-sqlite';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Swipeable } from 'react-native-gesture-handler';
import * as Haptics from 'expo-haptics';
import { Colors } from '@/src/constants/colors';
import { Typography } from '@/src/constants/typography';
import { useBook } from '@/src/context/BookContext';
import { getCategoryUsageCount } from '@/src/db/books';
import { CategoryFormModal } from '@/src/components/category/CategoryFormModal';
import type { BookCategory } from '@/src/db/types';
import type { CategoryType } from '@/src/constants/categories';

function DeleteAction() {
  return (
    <View style={styles.deleteAction}>
      <FontAwesome name="trash" size={20} color="#FFFDF7" />
    </View>
  );
}

interface CategoryRowProps {
  item: BookCategory;
  index: number;
  usageCount: number;
  onEdit: (item: BookCategory) => void;
  onDelete: (item: BookCategory) => void;
}

function CategoryRow({ item, index, usageCount, onEdit, onDelete }: CategoryRowProps) {
  const handleSwipeOpen = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    if (usageCount > 0) {
      Alert.alert(
        'Delete Category',
        `${usageCount} transaction${usageCount === 1 ? '' : 's'} use "${item.label}". Those transactions will show as "Uncategorized". Delete anyway?`,
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Delete',
            style: 'destructive',
            onPress: () => onDelete(item),
          },
        ]
      );
    } else {
      Alert.alert(
        'Delete Category',
        `Delete "${item.label}"?`,
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Delete',
            style: 'destructive',
            onPress: () => onDelete(item),
          },
        ]
      );
    }
  };

  return (
    <Animated.View entering={FadeInDown.delay(Math.min(index, 10) * 50).springify()}>
      <Swipeable
        renderRightActions={DeleteAction}
        onSwipeableOpen={handleSwipeOpen}
        overshootRight={false}
      >
        <Pressable
          style={({ pressed }) => [styles.row, { opacity: pressed ? 0.7 : 1 }]}
          onPress={() => onEdit(item)}
        >
          <View style={[styles.iconContainer, { backgroundColor: `${item.color}15` }]}>
            <FontAwesome name={item.icon as any} size={16} color={item.color} />
          </View>
          <Text style={styles.rowLabel} numberOfLines={1}>
            {item.label}
          </Text>
          {usageCount > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{usageCount}</Text>
            </View>
          )}
          <FontAwesome name="pencil" size={14} color={Colors.textMuted} />
        </Pressable>
      </Swipeable>
    </Animated.View>
  );
}

export default function CategoriesScreen() {
  const router = useRouter();
  const db = useSQLiteContext();
  const { bookId, rawCategories, updateCategory, deleteCategory } = useBook();

  const [usageCounts, setUsageCounts] = useState<Record<string, number>>({});
  const [editingCategory, setEditingCategory] = useState<BookCategory | null>(null);
  const [addingType, setAddingType] = useState<CategoryType | null>(null);

  const loadUsageCounts = useCallback(async () => {
    const counts: Record<string, number> = {};
    for (const cat of rawCategories) {
      counts[cat.category_id] = await getCategoryUsageCount(db, bookId, cat.category_id);
    }
    setUsageCounts(counts);
  }, [db, bookId, rawCategories]);

  useEffect(() => {
    loadUsageCounts();
  }, [loadUsageCounts]);

  const expenseCategories = rawCategories.filter((c) => c.type === 'expense');
  const incomeCategories = rawCategories.filter((c) => c.type === 'income');

  const sections = [
    { title: 'EXPENSES', data: expenseCategories, type: 'expense' as CategoryType },
    { title: 'INCOME', data: incomeCategories, type: 'income' as CategoryType },
  ];

  const handleEdit = (item: BookCategory) => {
    setEditingCategory(item);
  };

  const handleDelete = async (item: BookCategory) => {
    await deleteCategory(item.id);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    loadUsageCounts();
  };

  const handleEditSubmit = async (label: string, icon: string, color: string) => {
    if (!editingCategory) return;
    await updateCategory(editingCategory.id, { label, icon, color });
    setEditingCategory(null);
  };

  const { addCategory } = useBook();

  const handleAddSubmit = async (label: string, icon: string, color: string) => {
    if (!addingType) return;
    await addCategory(label, icon, color, addingType);
    setAddingType(null);
    loadUsageCounts();
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} hitSlop={12}>
          <FontAwesome name="chevron-left" size={16} color={Colors.textSecondary} />
        </Pressable>
        <Text style={styles.headerTitle}>Categories</Text>
        <View style={{ width: 16 }} />
      </View>

      <SectionList
        sections={sections}
        keyExtractor={(item) => String(item.id)}
        renderSectionHeader={({ section }) => (
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
          </View>
        )}
        renderItem={({ item, index }) => (
          <CategoryRow
            item={item}
            index={index}
            usageCount={usageCounts[item.category_id] ?? 0}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        )}
        renderSectionFooter={({ section }) => (
          <Pressable
            style={styles.addRow}
            onPress={() => setAddingType(section.type)}
          >
            <FontAwesome name="plus" size={14} color={Colors.inkBlue} />
            <Text style={styles.addRowText}>
              Add {section.type === 'expense' ? 'Expense' : 'Income'} Category
            </Text>
          </Pressable>
        )}
        stickySectionHeadersEnabled={false}
        contentContainerStyle={styles.listContent}
      />

      <CategoryFormModal
        visible={editingCategory !== null}
        onClose={() => setEditingCategory(null)}
        onSubmit={handleEditSubmit}
        initialValues={
          editingCategory
            ? { label: editingCategory.label, icon: editingCategory.icon, color: editingCategory.color }
            : undefined
        }
        title="Edit Category"
        type={editingCategory?.type ?? 'expense'}
      />

      <CategoryFormModal
        visible={addingType !== null}
        onClose={() => setAddingType(null)}
        onSubmit={handleAddSubmit}
        type={addingType ?? 'expense'}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  headerTitle: {
    ...Typography.h2,
    color: Colors.textPrimary,
  },
  listContent: {
    paddingBottom: 40,
  },
  sectionHeader: {
    paddingHorizontal: 16,
    paddingTop: 24,
    paddingBottom: 8,
  },
  sectionTitle: {
    ...Typography.small,
    color: Colors.textSecondary,
  },
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
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowLabel: {
    ...Typography.body,
    color: Colors.textPrimary,
    flex: 1,
    marginLeft: 12,
  },
  badge: {
    backgroundColor: Colors.surfaceLight,
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginRight: 12,
  },
  badgeText: {
    ...Typography.caption,
    color: Colors.textSecondary,
  },
  addRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginHorizontal: 16,
    gap: 10,
  },
  addRowText: {
    ...Typography.body,
    color: Colors.inkBlue,
  },
  deleteAction: {
    backgroundColor: Colors.inkRed,
    justifyContent: 'center',
    alignItems: 'center',
    width: 80,
    marginRight: 16,
  },
});
