import React, { useCallback, useState } from 'react';
import { StyleSheet, View, Text, ScrollView, Alert, Pressable } from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSQLiteContext } from 'expo-sqlite';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import * as Haptics from 'expo-haptics';
import { Colors } from '@/src/constants/colors';
import { Typography } from '@/src/constants/typography';
import { useBooks } from '@/src/hooks/useBooks';
import { useAuth } from '@/src/context/AuthContext';
import { deleteAllUserData } from '@/src/services/syncService';
import { BookSpine } from '@/src/components/bookshelf/BookSpine';
import { NewBookButton } from '@/src/components/bookshelf/NewBookButton';
import type { Book } from '@/src/db/types';

// Module-level flag so auto-open only fires once per app session
let hasAutoOpened = false;

export default function BookshelfScreen() {
  const { books, loading, refresh, remove, getLastOpenBookId, setLastOpenBookId } =
    useBooks();
  const { signOut } = useAuth();
  const db = useSQLiteContext();
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);

  const handleDeleteAccount = () => {
    Alert.alert(
      'Delete Account',
      'This will permanently delete your account and all data. Continue?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Continue',
          style: 'destructive',
          onPress: () => {
            Alert.alert(
              'Are you sure?',
              'This cannot be undone. All books, transactions, and settings will be permanently deleted.',
              [
                { text: 'Cancel', style: 'cancel' },
                {
                  text: 'Delete Account',
                  style: 'destructive',
                  onPress: async () => {
                    try {
                      setDeleting(true);
                      await deleteAllUserData(db);
                      await signOut();
                    } catch (error) {
                      console.error('Failed to delete account:', error);
                      Alert.alert('Error', 'Failed to delete account. Please try again.');
                    } finally {
                      setDeleting(false);
                    }
                  },
                },
              ]
            );
          },
        },
      ]
    );
  };

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
      <View style={styles.headerRow}>
        <Text style={styles.header}>In The Black</Text>
        <View style={styles.headerActions}>
          <Pressable
            onPress={handleDeleteAccount}
            disabled={deleting}
            style={styles.headerButton}
            hitSlop={12}
            testID="delete-account-button"
          >
            <FontAwesome name="user-times" size={16} color="#9C8B7A" />
          </Pressable>
          <Pressable
            onPress={() => {
              Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
                { text: 'Cancel', style: 'cancel' },
                {
                  text: 'Sign Out',
                  style: 'destructive',
                  onPress: () => signOut(),
                },
              ]);
            }}
            style={styles.headerButton}
            hitSlop={12}
          >
            <FontAwesome name="sign-out" size={18} color="#9C8B7A" />
          </Pressable>
        </View>
      </View>
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
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 4,
  },
  header: {
    ...Typography.h1,
    color: '#F5F0E8',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  headerButton: {
    padding: 8,
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
