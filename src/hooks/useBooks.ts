import { useState, useEffect, useCallback } from 'react';
import { useSQLiteContext } from 'expo-sqlite';
import * as Sentry from '@sentry/react-native';
import type { Book } from '../db/types';
import type { Category } from '../constants/categories';
import * as booksDb from '../db/books';
import { useAuth } from '../context/AuthContext';
import * as sync from '../services/syncService';
import { captureSyncError } from '../utils/captureSync';

export function useBooks() {
  const db = useSQLiteContext();
  const { user } = useAuth();
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    try {
      const data = await booksDb.getAllBooks(db);
      setBooks(data);
    } catch (error) {
      console.error('Failed to fetch books:', error);
      Sentry.captureException(error);
    } finally {
      setLoading(false);
    }
  }, [db]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const createFromTemplate = useCallback(
    async (
      name: string,
      templateCategories: Category[],
      templateKey: string | null,
      icon: string,
      color: string
    ) => {
      const id = await booksDb.createBookFromTemplate(
        db,
        name,
        templateCategories,
        templateKey,
        icon,
        color
      );
      await refresh();

      // Sync: push book + its categories
      if (user) {
        sync.pushBook(db, user.id, id).catch(captureSyncError('pushBook'));
        const cats = await booksDb.getRawBookCategories(db, id);
        for (const cat of cats) {
          sync.pushCategory(db, user.id, cat.id).catch(captureSyncError('pushCategory'));
        }
      }

      return id;
    },
    [db, refresh, user]
  );

  const remove = useCallback(
    async (id: number) => {
      // Grab server_id before local delete
      const book = await booksDb.getBookById(db, id);
      const serverId = book?.server_id ?? null;

      await booksDb.deleteBook(db, id);
      await refresh();

      if (user && serverId) {
        sync.pushDeleteBook(serverId).catch(captureSyncError('pushDeleteBook'));
      }
    },
    [db, refresh, user]
  );

  const getLastOpenBookId = useCallback(async () => {
    return booksDb.getLastOpenBookId(db);
  }, [db]);

  const setLastOpenBookId = useCallback(
    async (bookId: number) => {
      await booksDb.setLastOpenBookId(db, bookId);

      if (user) {
        const book = await booksDb.getBookById(db, bookId);
        if (book?.server_id) {
          sync.pushSettings(user.id, 'last_open_book_id', book.server_id).catch(
            captureSyncError('pushSettings')
          );
        }
      }
    },
    [db, user]
  );

  return {
    books,
    loading,
    refresh,
    createFromTemplate,
    remove,
    getLastOpenBookId,
    setLastOpenBookId,
  };
}
