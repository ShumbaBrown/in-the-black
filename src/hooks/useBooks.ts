import { useState, useEffect, useCallback } from 'react';
import { useSQLiteContext } from 'expo-sqlite';
import type { Book } from '../db/types';
import type { Category } from '../constants/categories';
import * as booksDb from '../db/books';

export function useBooks() {
  const db = useSQLiteContext();
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    try {
      const data = await booksDb.getAllBooks(db);
      setBooks(data);
    } catch (error) {
      console.error('Failed to fetch books:', error);
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
      return id;
    },
    [db, refresh]
  );

  const remove = useCallback(
    async (id: number) => {
      await booksDb.deleteBook(db, id);
      await refresh();
    },
    [db, refresh]
  );

  const getLastOpenBookId = useCallback(async () => {
    return booksDb.getLastOpenBookId(db);
  }, [db]);

  const setLastOpenBookId = useCallback(
    async (bookId: number) => {
      await booksDb.setLastOpenBookId(db, bookId);
    },
    [db]
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
