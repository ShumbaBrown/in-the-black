import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  Pressable,
  KeyboardAvoidingView,
  ScrollView,
  Alert,
  Keyboard,
  Platform,
} from 'react-native';
import { LedgerDatePicker } from '@/src/components/ui/LedgerDatePicker';
import * as Haptics from 'expo-haptics';
import { Colors } from '@/src/constants/colors';
import { Typography } from '@/src/constants/typography';
import { SegmentedToggle } from '@/src/components/ui/SegmentedToggle';
import { CategoryPicker } from './CategoryPicker';
import { GradientButton } from '@/src/components/ui/GradientButton';
import { toDateString } from '@/src/utils/dates';
import type { NewTransaction } from '@/src/db/types';

interface Props {
  initialValues?: NewTransaction;
  onSubmit: (transaction: NewTransaction) => void;
  onDelete?: () => void;
  submitLabel?: string;
}

export function TransactionForm({
  initialValues,
  onSubmit,
  onDelete,
  submitLabel = 'Save Transaction',
}: Props) {
  const [type, setType] = useState<'expense' | 'income'>(
    initialValues?.type ?? 'expense'
  );
  const [amount, setAmount] = useState(
    initialValues?.amount ? initialValues.amount.toString() : ''
  );
  const [description, setDescription] = useState(initialValues?.description ?? '');
  const [category, setCategory] = useState<string | null>(
    initialValues?.category ?? null
  );
  const [date, setDate] = useState(
    initialValues?.date ? new Date(initialValues.date + 'T00:00:00') : new Date()
  );
  const typeIndex = type === 'expense' ? 0 : 1;
  const accentColor = type === 'expense' ? Colors.inkRed : Colors.inkBlack;
  const buttonColors = type === 'expense'
    ? ([Colors.inkRed, Colors.inkRed] as const)
    : ([Colors.inkBlack, Colors.inkBlack] as const);

  const handleTypeChange = (index: number) => {
    const newType = index === 0 ? 'expense' : 'income';
    setType(newType);
    setCategory(null);
    Haptics.selectionAsync();
  };

  const handleSubmit = () => {
    const parsedAmount = parseFloat(amount);
    if (!parsedAmount || parsedAmount <= 0) {
      Alert.alert('Invalid Amount', 'Please enter a valid amount greater than 0.');
      return;
    }
    if (!description.trim()) {
      Alert.alert('Missing Description', 'Please enter a description.');
      return;
    }
    if (!category) {
      Alert.alert('Missing Category', 'Please select a category.');
      return;
    }

    onSubmit({
      type,
      amount: parsedAmount,
      description: description.trim(),
      category,
      date: toDateString(date),
    });
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete Transaction',
      'Are you sure you want to delete this transaction?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
            onDelete?.();
          },
        },
      ]
    );
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.flex}
    >
      <ScrollView
        style={styles.flex}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        onScrollBeginDrag={Keyboard.dismiss}
      >
        <Pressable onPress={Keyboard.dismiss}>
        <SegmentedToggle
          options={['Expense', 'Income']}
          selected={typeIndex}
          onSelect={handleTypeChange}
          activeColor={accentColor}
        />

        <View style={styles.amountContainer}>
          <TextInput
            style={[styles.amountInput, { color: accentColor, borderBottomColor: accentColor }]}
            value={amount ? `$${amount}` : ''}
            onChangeText={(text) => setAmount(text.replace(/[^0-9.]/g, ''))}
            keyboardType="decimal-pad"
            placeholder="$0.00"
            placeholderTextColor={Colors.textMuted}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>DESCRIPTION</Text>
          <TextInput
            style={styles.textInput}
            value={description}
            onChangeText={setDescription}
            placeholder="What's this for?"
            placeholderTextColor={Colors.textMuted}
            maxLength={100}
          />
        </View>

        <CategoryPicker type={type} selected={category} onSelect={setCategory} />

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>DATE</Text>
          <LedgerDatePicker
            value={date}
            onChange={setDate}
            maximumDate={new Date()}
          />
        </View>

        <View style={styles.actions}>
          <GradientButton
            title={submitLabel}
            onPress={handleSubmit}
            colors={buttonColors}
          />
          {onDelete && (
            <Pressable style={styles.deleteButton} onPress={handleDelete}>
              <Text style={styles.deleteText}>VOID</Text>
            </Pressable>
          )}
        </View>
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  content: {
    padding: 16,
    paddingBottom: 40,
  },
  amountContainer: {
    alignItems: 'center',
    marginTop: 32,
    marginBottom: 24,
  },
  amountInput: {
    fontSize: 48,
    fontFamily: 'SpaceMono',
    width: '100%',
    textAlign: 'center',
    letterSpacing: -1,
    borderBottomWidth: 1,
    paddingBottom: 4,
  },
  inputGroup: {
    marginTop: 20,
  },
  inputLabel: {
    ...Typography.caption,
    color: Colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 8,
  },
  textInput: {
    backgroundColor: Colors.surface,
    borderRadius: 2,
    padding: 16,
    ...Typography.body,
    color: Colors.textPrimary,
    borderWidth: 1,
    borderColor: Colors.border,
    borderBottomWidth: 2,
    borderBottomColor: Colors.borderHeavy,
  },
  actions: {
    marginTop: 32,
    gap: 16,
  },
  deleteButton: {
    alignItems: 'center',
    padding: 16,
  },
  deleteText: {
    ...Typography.bodyBold,
    color: Colors.inkRed,
    textTransform: 'uppercase',
    letterSpacing: 2,
  },
});
