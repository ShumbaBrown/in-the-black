import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  Pressable,
  Platform,
  KeyboardAvoidingView,
  ScrollView,
  Alert,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as Haptics from 'expo-haptics';
import { Colors } from '@/src/constants/colors';
import { Typography } from '@/src/constants/typography';
import { SegmentedToggle } from '@/src/components/ui/SegmentedToggle';
import { CategoryPicker } from './CategoryPicker';
import { GradientButton } from '@/src/components/ui/GradientButton';
import { toDateString, formatDate } from '@/src/utils/dates';
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
  const [showDatePicker, setShowDatePicker] = useState(false);

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
      >
        <SegmentedToggle
          options={['Expense', 'Income']}
          selected={typeIndex}
          onSelect={handleTypeChange}
          activeColor={accentColor}
        />

        <View style={styles.amountContainer}>
          <Text style={[styles.currencySymbol, { color: accentColor }]}>$</Text>
          <TextInput
            style={[styles.amountInput, { color: accentColor, borderBottomColor: accentColor }]}
            value={amount}
            onChangeText={setAmount}
            keyboardType="decimal-pad"
            placeholder="0.00"
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
          <Pressable
            style={styles.dateButton}
            onPress={() => setShowDatePicker(true)}
          >
            <Text style={styles.dateText}>{formatDate(toDateString(date))}</Text>
          </Pressable>
          {showDatePicker && (
            <DateTimePicker
              value={date}
              mode="date"
              display={Platform.OS === 'ios' ? 'inline' : 'default'}
              onChange={(_, selectedDate) => {
                setShowDatePicker(Platform.OS === 'ios');
                if (selectedDate) setDate(selectedDate);
              }}
              themeVariant="light"
              maximumDate={new Date()}
            />
          )}
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 32,
    marginBottom: 24,
  },
  currencySymbol: {
    fontSize: 36,
    fontFamily: 'SpaceMono',
    marginRight: 4,
  },
  amountInput: {
    fontSize: 48,
    fontFamily: 'SpaceMono',
    minWidth: 120,
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
  dateButton: {
    backgroundColor: Colors.surface,
    borderRadius: 2,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    borderBottomWidth: 2,
    borderBottomColor: Colors.borderHeavy,
  },
  dateText: {
    ...Typography.body,
    color: Colors.textPrimary,
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
