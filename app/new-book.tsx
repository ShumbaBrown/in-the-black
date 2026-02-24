import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  Pressable,
  ScrollView,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import * as Haptics from 'expo-haptics';
import { Colors } from '@/src/constants/colors';
import { Typography } from '@/src/constants/typography';
import { HOBBY_TEMPLATES, type HobbyTemplate } from '@/src/constants/categories';
import { useBooks } from '@/src/hooks/useBooks';
import { GradientButton } from '@/src/components/ui/GradientButton';

export default function NewBookScreen() {
  const router = useRouter();
  const { createFromTemplate, setLastOpenBookId } = useBooks();
  const [name, setName] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState<HobbyTemplate | null>(null);

  const handleTemplatePress = (template: HobbyTemplate) => {
    setSelectedTemplate(template);
    if (!name) {
      setName(template.name);
    }
    Haptics.selectionAsync();
  };

  const handleBlankPress = () => {
    setSelectedTemplate(null);
    Haptics.selectionAsync();
  };

  const handleCreate = async () => {
    if (!name.trim()) {
      Alert.alert('Missing Name', 'Please enter a name for your book.');
      return;
    }

    const template = selectedTemplate;
    const categories = template?.categories ?? [];
    const icon = template?.icon ?? 'book';
    const color = template?.color ?? '#8B4513';
    const templateKey = template?.key ?? null;

    const bookId = await createFromTemplate(
      name.trim(),
      categories,
      templateKey,
      icon,
      color
    );
    await setLastOpenBookId(bookId);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    router.replace(`/book/${bookId}`);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.headerRow}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <FontAwesome name="chevron-down" size={18} color={Colors.textSecondary} />
        </Pressable>
        <Text style={styles.header}>New Book</Text>
        <View style={styles.backButton} />
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>BOOK NAME</Text>
          <TextInput
            style={styles.textInput}
            value={name}
            onChangeText={setName}
            placeholder="My Hobby Ledger"
            placeholderTextColor={Colors.textMuted}
            maxLength={40}
            autoFocus
          />
        </View>

        <View style={styles.templateSection}>
          <Text style={styles.inputLabel}>CHOOSE A TEMPLATE</Text>
          <Text style={styles.templateHint}>
            Templates include tailored expense and income categories
          </Text>

          <View style={styles.templateGrid}>
            {/* Blank option */}
            <Pressable
              style={[
                styles.templateItem,
                !selectedTemplate && styles.templateItemSelected,
              ]}
              onPress={handleBlankPress}
            >
              <View
                style={[
                  styles.templateIcon,
                  {
                    backgroundColor: !selectedTemplate
                      ? '#8B451320'
                      : Colors.surfaceLight,
                  },
                ]}
              >
                <FontAwesome
                  name="book"
                  size={22}
                  color={!selectedTemplate ? '#8B4513' : Colors.textSecondary}
                />
              </View>
              <Text
                style={[
                  styles.templateName,
                  !selectedTemplate && styles.templateNameSelected,
                ]}
              >
                Blank
              </Text>
            </Pressable>

            {HOBBY_TEMPLATES.map((template) => {
              const isSelected = selectedTemplate?.key === template.key;
              return (
                <Pressable
                  key={template.key}
                  style={[
                    styles.templateItem,
                    isSelected && {
                      borderColor: template.color,
                      backgroundColor: `${template.color}08`,
                    },
                  ]}
                  onPress={() => handleTemplatePress(template)}
                >
                  <View
                    style={[
                      styles.templateIcon,
                      {
                        backgroundColor: isSelected
                          ? `${template.color}20`
                          : Colors.surfaceLight,
                      },
                    ]}
                  >
                    <FontAwesome
                      name={template.icon as any}
                      size={22}
                      color={isSelected ? template.color : Colors.textSecondary}
                    />
                  </View>
                  <Text
                    style={[
                      styles.templateName,
                      isSelected && styles.templateNameSelected,
                    ]}
                    numberOfLines={1}
                  >
                    {template.name}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        <View style={styles.actions}>
          <GradientButton
            title="Create Book"
            onPress={handleCreate}
            colors={
              selectedTemplate
                ? [selectedTemplate.color, selectedTemplate.color]
                : ['#8B4513', '#8B4513']
            }
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 4,
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    ...Typography.h2,
    color: Colors.textPrimary,
    textAlign: 'center',
  },
  content: {
    padding: 16,
    paddingBottom: 40,
  },
  inputGroup: {
    marginBottom: 24,
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
  templateSection: {
    marginBottom: 24,
  },
  templateHint: {
    ...Typography.caption,
    color: Colors.textMuted,
    marginBottom: 16,
  },
  templateGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  templateItem: {
    width: '30.5%',
    alignItems: 'center',
    padding: 12,
    borderRadius: 2,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  templateItemSelected: {
    borderColor: '#8B4513',
    backgroundColor: '#8B451308',
  },
  templateIcon: {
    width: 44,
    height: 44,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  templateName: {
    ...Typography.caption,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  templateNameSelected: {
    color: Colors.textPrimary,
  },
  actions: {
    marginTop: 8,
  },
});
