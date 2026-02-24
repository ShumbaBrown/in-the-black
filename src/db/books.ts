import type { SQLiteDatabase } from 'expo-sqlite';
import type { Book, NewBook, BookCategory } from './types';
import type { Category } from '../constants/categories';

export async function getAllBooks(db: SQLiteDatabase): Promise<Book[]> {
  return db.getAllAsync<Book>(
    'SELECT * FROM books ORDER BY updated_at DESC'
  );
}

export async function getBookById(
  db: SQLiteDatabase,
  id: number
): Promise<Book | null> {
  return db.getFirstAsync<Book>(
    'SELECT * FROM books WHERE id = ?',
    [id]
  );
}

export async function createBook(
  db: SQLiteDatabase,
  book: NewBook
): Promise<number> {
  const result = await db.runAsync(
    'INSERT INTO books (name, hobby_template, icon, color) VALUES (?, ?, ?, ?)',
    [book.name, book.hobby_template, book.icon, book.color]
  );
  return result.lastInsertRowId;
}

export async function deleteBook(
  db: SQLiteDatabase,
  id: number
): Promise<void> {
  // Delete associated transactions first
  await db.runAsync('DELETE FROM transactions WHERE book_id = ?', [id]);
  // Delete book categories
  await db.runAsync('DELETE FROM book_categories WHERE book_id = ?', [id]);
  // Delete the book
  await db.runAsync('DELETE FROM books WHERE id = ?', [id]);
}

export async function getBookCategories(
  db: SQLiteDatabase,
  bookId: number
): Promise<Category[]> {
  const rows = await db.getAllAsync<BookCategory>(
    'SELECT * FROM book_categories WHERE book_id = ? ORDER BY type, sort_order',
    [bookId]
  );
  return rows.map((row) => ({
    id: row.category_id,
    label: row.label,
    icon: row.icon,
    color: row.color,
    type: row.type,
  }));
}

export async function getBookCategoriesByType(
  db: SQLiteDatabase,
  bookId: number,
  type: 'expense' | 'income'
): Promise<Category[]> {
  const rows = await db.getAllAsync<BookCategory>(
    'SELECT * FROM book_categories WHERE book_id = ? AND type = ? ORDER BY sort_order',
    [bookId, type]
  );
  return rows.map((row) => ({
    id: row.category_id,
    label: row.label,
    icon: row.icon,
    color: row.color,
    type: row.type,
  }));
}

export async function getBookCategoryById(
  db: SQLiteDatabase,
  bookId: number,
  categoryId: string
): Promise<Category | null> {
  const row = await db.getFirstAsync<BookCategory>(
    'SELECT * FROM book_categories WHERE book_id = ? AND category_id = ?',
    [bookId, categoryId]
  );
  if (!row) return null;
  return {
    id: row.category_id,
    label: row.label,
    icon: row.icon,
    color: row.color,
    type: row.type,
  };
}

export async function insertBookCategories(
  db: SQLiteDatabase,
  bookId: number,
  categories: Category[]
): Promise<void> {
  for (let i = 0; i < categories.length; i++) {
    const cat = categories[i];
    await db.runAsync(
      'INSERT INTO book_categories (book_id, category_id, label, icon, color, type, sort_order) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [bookId, cat.id, cat.label, cat.icon, cat.color, cat.type, i]
    );
  }
}

export async function getLastOpenBookId(
  db: SQLiteDatabase
): Promise<number | null> {
  const row = await db.getFirstAsync<{ value: string }>(
    "SELECT value FROM app_settings WHERE key = 'last_open_book_id'"
  );
  if (!row) return null;
  const id = parseInt(row.value, 10);
  // Verify the book still exists
  const book = await getBookById(db, id);
  return book ? id : null;
}

export async function setLastOpenBookId(
  db: SQLiteDatabase,
  bookId: number
): Promise<void> {
  await db.runAsync(
    "INSERT OR REPLACE INTO app_settings (key, value) VALUES ('last_open_book_id', ?)",
    [String(bookId)]
  );
}

export async function createBookFromTemplate(
  db: SQLiteDatabase,
  name: string,
  templateCategories: Category[],
  templateKey: string | null,
  icon: string,
  color: string
): Promise<number> {
  const bookId = await createBook(db, {
    name,
    hobby_template: templateKey,
    icon,
    color,
  });
  await insertBookCategories(db, bookId, templateCategories);
  return bookId;
}
