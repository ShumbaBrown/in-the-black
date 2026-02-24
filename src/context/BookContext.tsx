import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useSQLiteContext } from 'expo-sqlite';
import { getBookById, getBookCategories } from '../db/books';
import type { Book } from '../db/types';
import type { Category, CategoryType } from '../constants/categories';

interface BookContextValue {
  book: Book;
  bookId: number;
  categories: Category[];
  getCategoryById: (id: string) => Category | undefined;
  getCategoriesByType: (type: CategoryType) => Category[];
  refreshCategories: () => Promise<void>;
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
  const [loading, setLoading] = useState(true);

  const refreshCategories = useCallback(async () => {
    const cats = await getBookCategories(db, bookId);
    setCategories(cats);
  }, [db, bookId]);

  useEffect(() => {
    const load = async () => {
      const [b, cats] = await Promise.all([
        getBookById(db, bookId),
        getBookCategories(db, bookId),
      ]);
      setBook(b);
      setCategories(cats);
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

  if (loading || !book) {
    return null;
  }

  return (
    <BookContext.Provider
      value={{
        book,
        bookId,
        categories,
        getCategoryById,
        getCategoriesByType,
        refreshCategories,
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
