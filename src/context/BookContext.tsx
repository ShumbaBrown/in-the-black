import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useSQLiteContext } from 'expo-sqlite';
import {
  getBookById,
  getBookCategories,
  getRawBookCategories,
  addBookCategory,
  updateBookCategory,
  deleteBookCategory,
} from '../db/books';
import type { Book, BookCategory } from '../db/types';
import type { Category, CategoryType } from '../constants/categories';
import { useAuth } from './AuthContext';
import * as sync from '../services/syncService';
import { captureSyncError } from '../utils/captureSync';

interface BookContextValue {
  book: Book;
  bookId: number;
  categories: Category[];
  rawCategories: BookCategory[];
  getCategoryById: (id: string) => Category | undefined;
  getCategoriesByType: (type: CategoryType) => Category[];
  refreshCategories: () => Promise<void>;
  addCategory: (label: string, icon: string, color: string, type: CategoryType) => Promise<string>;
  updateCategory: (bookCategoryId: number, updates: { label?: string; icon?: string; color?: string }) => Promise<void>;
  deleteCategory: (bookCategoryId: number) => Promise<void>;
}

const BookContext = createContext<BookContextValue | null>(null);

interface BookProviderProps {
  bookId: number;
  children: React.ReactNode;
}

export function BookProvider({ bookId, children }: BookProviderProps) {
  const db = useSQLiteContext();
  const { user } = useAuth();
  const [book, setBook] = useState<Book | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [rawCategories, setRawCategories] = useState<BookCategory[]>([]);
  const [loading, setLoading] = useState(true);

  const refreshCategories = useCallback(async () => {
    const [cats, raw] = await Promise.all([
      getBookCategories(db, bookId),
      getRawBookCategories(db, bookId),
    ]);
    setCategories(cats);
    setRawCategories(raw);
  }, [db, bookId]);

  useEffect(() => {
    const load = async () => {
      const [b, cats, raw] = await Promise.all([
        getBookById(db, bookId),
        getBookCategories(db, bookId),
        getRawBookCategories(db, bookId),
      ]);
      setBook(b);
      setCategories(cats);
      setRawCategories(raw);
      setLoading(false);
    };
    load();
  }, [db, bookId]);

  const getCategoryById = useCallback(
    (id: string) => categories.find((c) => c.id === id),
    [categories]
  );

  const getCategoriesByType = useCallback(
    (type: CategoryType) => categories.filter((c) => c.type === type),
    [categories]
  );

  const addCategoryFn = useCallback(
    async (label: string, icon: string, color: string, type: CategoryType): Promise<string> => {
      const categoryId = await addBookCategory(db, bookId, { label, icon, color, type });
      await refreshCategories();

      // Sync: find the newly inserted row and push it
      if (user) {
        const raw = await getRawBookCategories(db, bookId);
        const newCat = raw.find((c) => c.category_id === categoryId);
        if (newCat) {
          sync.pushCategory(db, user.id, newCat.id).catch(captureSyncError('pushCategory'));
        }
      }

      return categoryId;
    },
    [db, bookId, refreshCategories, user]
  );

  const updateCategoryFn = useCallback(
    async (bookCategoryId: number, updates: { label?: string; icon?: string; color?: string }) => {
      await updateBookCategory(db, bookCategoryId, updates);
      await refreshCategories();

      if (user) {
        sync.pushCategory(db, user.id, bookCategoryId).catch(captureSyncError('pushCategory'));
      }
    },
    [db, refreshCategories, user]
  );

  const deleteCategoryFn = useCallback(
    async (bookCategoryId: number) => {
      // Grab server_id before local delete
      const cat = await db.getFirstAsync<{ server_id: string | null }>(
        'SELECT server_id FROM book_categories WHERE id = ?',
        [bookCategoryId]
      );
      const serverId = cat?.server_id ?? null;

      await deleteBookCategory(db, bookCategoryId);
      await refreshCategories();

      if (user && serverId) {
        sync.pushDeleteCategory(serverId).catch(captureSyncError('pushDeleteCategory'));
      }
    },
    [db, refreshCategories, user]
  );

  if (loading || !book) {
    return null;
  }

  return (
    <BookContext.Provider
      value={{
        book,
        bookId,
        categories,
        rawCategories,
        getCategoryById,
        getCategoriesByType,
        refreshCategories,
        addCategory: addCategoryFn,
        updateCategory: updateCategoryFn,
        deleteCategory: deleteCategoryFn,
      }}
    >
      {children}
    </BookContext.Provider>
  );
}

export function useBook(): BookContextValue {
  const ctx = useContext(BookContext);
  if (!ctx) {
    throw new Error('useBook must be used within a BookProvider');
  }
  return ctx;
}
