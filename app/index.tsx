import React, { useCallback } from 'react';
import { StyleSheet, View, Text, ScrollView, Alert } from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { Colors } from '@/src/constants/colors';
import { Typography } from '@/src/constants/typography';
import { useBooks } from '@/src/hooks/useBooks';
import { BookSpine } from '@/src/components/bookshelf/BookSpine';
import { NewBookButton } from '@/src/components/bookshelf/NewBookButton';
import type { Book } from '@/src/db/types';

// Module-level flag so auto-open only fires once per app session
let hasAutoOpened = false;

export default function BookshelfScreen() {
  const { books, loading, refresh, remove, getLastOpenBookId, setLastOpenBookId } =
    useBooks();
  const router = useRouter();

  useFocusEffect(
    useCallback(() => {
      refresh();
    }, [refresh])
  );

  // Auto-open last book only on initial app launch
  useFocusEffect(
    useCallback(() => {
      if (hasAutoOpened || loading) return;
      hasAutoOpened = true;

      const checkLastBook = async () => {
        const lastBookId = await getLastOpenBookId();
        if (lastBookId) {
          router.replace(`/book/${lastBookId}`);
        }
      };
      checkLastBook();
    }, [loading, getLastOpenBookId, router])
  );

  const handleBookPress = async (book: Book) => {
    await setLastOpenBookId(book.id);
    router.push(`/book/${book.id}`);
  };

  const handleBookLongPress = (book: Book) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    Alert.alert(book.name, 'What would you like to do?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => {
          Alert.alert(
            'Delete Book',
            `Delete "${book.name}" and all its transactions? This cannot be undone.`,
            [
              { text: 'Cancel', style: 'cancel' },
              {
                text: 'Delete',
                style: 'destructive',
                onPress: async () => {
                  await remove(book.id);
                  Haptics.notificationAsync(
                    Haptics.NotificationFeedbackType.Warning
                  );
                },
              },
            ]
          );
        },
      },
    ]);
  };

  const handleNewBook = () => {
    router.push('/new-book');
  };

  if (loading && !hasAutoOpened) {
    return <View style={styles.container} />;
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Text style={styles.header}>In The Black</Text>
      <Text style={styles.subtitle}>YOUR LEDGER BOOKS</Text>
      <ScrollView
        contentContainerStyle={styles.shelfContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.shelf}>
          {books.map((book) => (
            <BookSpine
              key={book.id}
              book={book}
              onPress={() => handleBookPress(book)}
              onLongPress={() => handleBookLongPress(book)}
            />
          ))}
          <NewBookButton onPress={handleNewBook} />
        </View>
        {books.length === 0 && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyTitle}>No books yet</Text>
            <Text style={styles.emptyText}>
              Create your first ledger book to start tracking
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#3C2415',
  },
  header: {
    ...Typography.h1,
    color: '#F5F0E8',
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 4,
  },
  subtitle: {
    ...Typography.small,
    color: '#9C8B7A',
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  shelfContent: {
    paddingBottom: 40,
  },
  shelf: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
    gap: 16,
  },
  emptyState: {
    alignItems: 'center',
    paddingTop: 40,
    paddingHorizontal: 40,
  },
  emptyTitle: {
    ...Typography.h3,
    color: '#F5F0E8',
    marginBottom: 8,
  },
  emptyText: {
    ...Typography.body,
    color: '#9C8B7A',
    textAlign: 'center',
  },
});
