import type { SQLiteDatabase } from 'expo-sqlite';

const CURRENT_SCHEMA_VERSION = 2;

async function getSchemaVersion(db: SQLiteDatabase): Promise<number> {
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS schema_version (
      version INTEGER NOT NULL
    );
  `);
  const row = await db.getFirstAsync<{ version: number }>(
    'SELECT version FROM schema_version LIMIT 1'
  );
  return row?.version ?? 0;
}

async function setSchemaVersion(db: SQLiteDatabase, version: number): Promise<void> {
  await db.runAsync('DELETE FROM schema_version');
  await db.runAsync('INSERT INTO schema_version (version) VALUES (?)', [version]);
}

async function migrateV1(db: SQLiteDatabase): Promise<void> {
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS transactions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      type TEXT NOT NULL CHECK(type IN ('expense', 'income')),
      amount REAL NOT NULL CHECK(amount > 0),
      description TEXT NOT NULL,
      category TEXT NOT NULL,
      date TEXT NOT NULL,
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now'))
    );
  `);
}

async function migrateV2(db: SQLiteDatabase): Promise<void> {
  // Create books table
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS books (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      hobby_template TEXT,
      icon TEXT NOT NULL DEFAULT 'book',
      color TEXT NOT NULL DEFAULT '#8B4513',
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now'))
    );
  `);

  // Create book_categories table
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS book_categories (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      book_id INTEGER NOT NULL REFERENCES books(id) ON DELETE CASCADE,
      category_id TEXT NOT NULL,
      label TEXT NOT NULL,
      icon TEXT NOT NULL,
      color TEXT NOT NULL,
      type TEXT NOT NULL CHECK(type IN ('expense','income')),
      sort_order INTEGER NOT NULL DEFAULT 0,
      UNIQUE(book_id, category_id)
    );
  `);

  // Create app_settings table
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS app_settings (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL
    );
  `);

  // Add book_id column to transactions
  // Check if column already exists first
  const columns = await db.getAllAsync<{ name: string }>(
    "PRAGMA table_info(transactions)"
  );
  const hasBookId = columns.some((c) => c.name === 'book_id');

  if (!hasBookId) {
    await db.execAsync(
      'ALTER TABLE transactions ADD COLUMN book_id INTEGER REFERENCES books(id);'
    );
  }

  await db.execAsync(
    'CREATE INDEX IF NOT EXISTS idx_transactions_book_id ON transactions(book_id);'
  );

  // Create a default "General" book with Photography template categories
  // if there are existing transactions without a book_id
  const existingTransactions = await db.getFirstAsync<{ count: number }>(
    'SELECT COUNT(*) as count FROM transactions WHERE book_id IS NULL'
  );

  if (existingTransactions && existingTransactions.count > 0) {
    // Create the default book
    const result = await db.runAsync(
      "INSERT INTO books (name, hobby_template, icon, color) VALUES ('General', 'photography', 'camera', '#8B4513')"
    );
    const defaultBookId = result.lastInsertRowId;

    // Insert photography template categories for the default book
    const categories = [
      // Expenses
      ['camera-body', 'Camera Body', 'camera', '#8B4513', 'expense', 0],
      ['lenses', 'Lenses', 'eye', '#A0522D', 'expense', 1],
      ['lighting', 'Lighting', 'bolt', '#B8860B', 'expense', 2],
      ['accessories', 'Accessories', 'briefcase', '#6B4E71', 'expense', 3],
      ['software', 'Software', 'laptop', '#2E5A88', 'expense', 4],
      ['travel', 'Travel', 'plane', '#4A766E', 'expense', 5],
      ['studio', 'Studio', 'home', '#8B3A3A', 'expense', 6],
      ['printing', 'Printing', 'print', '#696156', 'expense', 7],
      ['education', 'Education', 'graduation-cap', '#4A7C59', 'expense', 8],
      // Income
      ['client-work', 'Client Work', 'users', '#1A1A1A', 'income', 0],
      ['print-sales', 'Print Sales', 'picture-o', '#2C4A2C', 'income', 1],
      ['stock-photos', 'Stock Photos', 'cloud-upload', '#2E5A88', 'income', 2],
      ['workshops', 'Workshops', 'group', '#8B7D37', 'income', 3],
      ['licensing', 'Licensing', 'file-text', '#6B4E71', 'income', 4],
      ['events', 'Events', 'calendar', '#A0522D', 'income', 5],
    ] as const;

    for (const cat of categories) {
      await db.runAsync(
        'INSERT INTO book_categories (book_id, category_id, label, icon, color, type, sort_order) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [defaultBookId, cat[0], cat[1], cat[2], cat[3], cat[4], cat[5]]
      );
    }

    // Assign all existing transactions to the default book
    await db.runAsync(
      'UPDATE transactions SET book_id = ? WHERE book_id IS NULL',
      [defaultBookId]
    );

    // Set as last open book
    await db.runAsync(
      "INSERT OR REPLACE INTO app_settings (key, value) VALUES ('last_open_book_id', ?)",
      [String(defaultBookId)]
    );
  }
}

export async function initDatabase(db: SQLiteDatabase): Promise<void> {
  await db.execAsync('PRAGMA foreign_keys = ON;');

  const currentVersion = await getSchemaVersion(db);

  if (currentVersion < 1) {
    await migrateV1(db);
  }

  if (currentVersion < 2) {
    await migrateV2(db);
  }

  if (currentVersion < CURRENT_SCHEMA_VERSION) {
    await setSchemaVersion(db, CURRENT_SCHEMA_VERSION);
  }
}
