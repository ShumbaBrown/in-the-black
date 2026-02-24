import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  Pressable,
  Modal,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Colors } from '@/src/constants/colors';
import { Typography } from '@/src/constants/typography';
import { ICON_OPTIONS, COLOR_OPTIONS } from '@/src/constants/pickerOptions';
import { GradientButton } from '@/src/components/ui/GradientButton';
import type { CategoryType } from '@/src/constants/categories';

interface Props {
  visible: boolean;
  onClose: () => void;
  onSubmit: (label: string, icon: string, color: string) => void;
  initialValues?: { label: string; icon: string; color: string };
  title?: string;
  type: CategoryType;
}

export function CategoryFormModal({
  visible,
  onClose,
  onSubmit,
  initialValues,
  title,
  type,
}: Props) {
  const [label, setLabel] = useState('');
  const [icon, setIcon] = useState<string>(ICON_OPTIONS[0]);
  const [color, setColor] = useState<string>(COLOR_OPTIONS[0]);

  useEffect(() => {
    if (visible) {
      if (initialValues) {
        setLabel(initialValues.label);
        setIcon(initialValues.icon);
        setColor(initialValues.color);
      } else {
        setLabel('');
        setIcon(ICON_OPTIONS[0]);
        setColor(COLOR_OPTIONS[0]);
      }
    }
  }, [visible, initialValues]);

  const handleSubmit = () => {
    const trimmed = label.trim();
    if (!trimmed) return;
    onSubmit(trimmed, icon, color);
  };

  const modalTitle = title ?? (initialValues ? 'Edit Category' : 'New Category');
  const typeLabel = type === 'expense' ? 'Expense' : 'Income';

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.header}>
          <Text style={styles.title}>{modalTitle}</Text>
          <Pressable onPress={onClose} hitSlop={12}>
            <FontAwesome name="times" size={20} color={Colors.textSecondary} />
          </Pressable>
        </View>

        <ScrollView style={styles.body} keyboardShouldPersistTaps="handled">
          <Text style={styles.sectionLabel}>TYPE</Text>
          <Text style={styles.typeValue}>{typeLabel}</Text>

          <Text style={styles.sectionLabel}>NAME</Text>
          <TextInput
            style={styles.input}
            value={label}
            onChangeText={(text) => setLabel(text.slice(0, 20))}
            placeholder="Category name"
            placeholderTextColor={Colors.textMuted}
            maxLength={20}
            autoFocus
          />
          <Text style={styles.charCount}>{label.length}/20</Text>

          <Text style={styles.sectionLabel}>ICON</Text>
          <View style={styles.iconGrid}>
            {ICON_OPTIONS.map((iconName) => (
              <Pressable
                key={iconName}
                style={[
                  styles.iconItem,
                  icon === iconName && { backgroundColor: `${color}20`, borderColor: color },
                ]}
                onPress={() => setIcon(iconName)}
              >
                <FontAwesome
                  name={iconName as any}
                  size={20}
                  color={icon === iconName ? color : Colors.textSecondary}
                />
              </Pressable>
            ))}
          </View>

          <Text style={styles.sectionLabel}>COLOR</Text>
          <View style={styles.colorRow}>
            {COLOR_OPTIONS.map((c) => (
              <Pressable
                key={c}
                style={[
                  styles.colorItem,
                  { backgroundColor: c },
                  color === c && styles.colorSelected,
                ]}
                onPress={() => setColor(c)}
              />
            ))}
          </View>

          <View style={styles.preview}>
            <Text style={styles.sectionLabel}>PREVIEW</Text>
            <View style={styles.previewRow}>
              <View style={[styles.previewIcon, { backgroundColor: `${color}20` }]}>
                <FontAwesome name={icon as any} size={18} color={color} />
              </View>
              <Text style={styles.previewLabel}>{label || 'Category Name'}</Text>
            </View>
          </View>

          <GradientButton
            title="Save"
            onPress={handleSubmit}
            disabled={!label.trim()}
            style={styles.saveButton}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </Modal>
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
    paddingTop: 20,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    backgroundColor: Colors.surface,
  },
  title: {
    ...Typography.h2,
    color: Colors.textPrimary,
  },
  body: {
    flex: 1,
    padding: 16,
  },
  sectionLabel: {
    ...Typography.caption,
    color: Colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginTop: 20,
    marginBottom: 8,
  },
  typeValue: {
    ...Typography.body,
    color: Colors.textPrimary,
  },
  input: {
    ...Typography.body,
    color: Colors.textPrimary,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 4,
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  charCount: {
    ...Typography.caption,
    color: Colors.textMuted,
    textAlign: 'right',
    marginTop: 4,
  },
  iconGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  iconItem: {
    width: 44,
    height: 44,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  colorRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  colorItem: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  colorSelected: {
    borderColor: Colors.background,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
    transform: [{ scale: 1.15 }],
  },
  preview: {
    marginTop: 8,
  },
  previewRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    padding: 12,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  previewIcon: {
    width: 40,
    height: 40,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  previewLabel: {
    ...Typography.body,
    color: Colors.textPrimary,
  },
  saveButton: {
    marginTop: 28,
    marginBottom: 40,
  },
});
