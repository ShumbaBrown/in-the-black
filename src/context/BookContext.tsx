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
      return categoryId;
    },
    [db, bookId, refreshCategories]
  );

  const updateCategoryFn = useCallback(
    async (bookCategoryId: number, updates: { label?: string; icon?: string; color?: string }) => {
      await updateBookCategory(db, bookCategoryId, updates);
      await refreshCategories();
    },
    [db, refreshCategories]
  );

  const deleteCategoryFn = useCallback(
    async (bookCategoryId: number) => {
      await deleteBookCategory(db, bookCategoryId);
      await refreshCategories();
    },
    [db, refreshCategories]
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
