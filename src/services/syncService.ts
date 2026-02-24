import type { SQLiteDatabase } from 'expo-sqlite';
import { supabase } from '../lib/supabase';

// ─── Push functions (local → cloud) ────────────────────────────────

export async function pushBook(
  db: SQLiteDatabase,
  userId: string,
  localBookId: number
): Promise<void> {
  const book = await db.getFirstAsync<{
    id: number; name: string; hobby_template: string | null;
    icon: string; color: string; server_id: string | null;
    created_at: string; updated_at: string;
  }>('SELECT * FROM books WHERE id = ?', [localBookId]);
  if (!book) return;

  if (book.server_id) {
    // UPDATE existing cloud record
    await supabase
      .from('books')
      .update({
        name: book.name,
        hobby_template: book.hobby_template,
        icon: book.icon,
        color: book.color,
        updated_at: new Date().toISOString(),
      })
      .eq('id', book.server_id);
  } else {
    // INSERT new cloud record
    const { data, error } = await supabase
      .from('books')
      .insert({
        user_id: userId,
        name: book.name,
        hobby_template: book.hobby_template,
        icon: book.icon,
        color: book.color,
      })
      .select('id')
      .single();

    if (!error && data) {
      await db.runAsync('UPDATE books SET server_id = ? WHERE id = ?', [
        data.id,
        localBookId,
      ]);
    }
  }
}

export async function pushTransaction(
  db: SQLiteDatabase,
  userId: string,
  localTxId: number
): Promise<void> {
  const tx = await db.getFirstAsync<{
    id: number; type: string; amount: number; description: string;
    category: string; date: string; book_id: number;
    server_id: string | null; created_at: string; updated_at: string;
  }>('SELECT * FROM transactions WHERE id = ?', [localTxId]);
  if (!tx) return;

  // Ensure parent book has a server_id
  const book = await db.getFirstAsync<{ server_id: string | null }>(
    'SELECT server_id FROM books WHERE id = ?',
    [tx.book_id]
  );
  if (!book?.server_id) {
    await pushBook(db, userId, tx.book_id);
  }
  const bookServerId = (
    await db.getFirstAsync<{ server_id: string }>(
      'SELECT server_id FROM books WHERE id = ?',
      [tx.book_id]
    )
  )?.server_id;
  if (!bookServerId) return;

  if (tx.server_id) {
    await supabase
      .from('transactions')
      .update({
        type: tx.type,
        amount: tx.amount,
        description: tx.description,
        category: tx.category,
        date: tx.date,
        book_id: bookServerId,
        updated_at: new Date().toISOString(),
      })
      .eq('id', tx.server_id);
  } else {
    const { data, error } = await supabase
      .from('transactions')
      .insert({
        user_id: userId,
        book_id: bookServerId,
        type: tx.type,
        amount: tx.amount,
        description: tx.description,
        category: tx.category,
        date: tx.date,
      })
      .select('id')
      .single();

    if (!error && data) {
      await db.runAsync('UPDATE transactions SET server_id = ? WHERE id = ?', [
        data.id,
        localTxId,
      ]);
    }
  }
}

export async function pushCategory(
  db: SQLiteDatabase,
  userId: string,
  localCatId: number
): Promise<void> {
  const cat = await db.getFirstAsync<{
    id: number; book_id: number; category_id: string; label: string;
    icon: string; color: string; type: string; sort_order: number;
    server_id: string | null;
  }>('SELECT * FROM book_categories WHERE id = ?', [localCatId]);
  if (!cat) return;

  // Ensure parent book has a server_id
  const book = await db.getFirstAsync<{ server_id: string | null }>(
    'SELECT server_id FROM books WHERE id = ?',
    [cat.book_id]
  );
  if (!book?.server_id) {
    await pushBook(db, userId, cat.book_id);
  }
  const bookServerId = (
    await db.getFirstAsync<{ server_id: string }>(
      'SELECT server_id FROM books WHERE id = ?',
      [cat.book_id]
    )
  )?.server_id;
  if (!bookServerId) return;

  if (cat.server_id) {
    await supabase
      .from('book_categories')
      .update({
        category_id: cat.category_id,
        label: cat.label,
        icon: cat.icon,
        color: cat.color,
        type: cat.type,
        sort_order: cat.sort_order,
      })
      .eq('id', cat.server_id);
  } else {
    const { data, error } = await supabase
      .from('book_categories')
      .insert({
        user_id: userId,
        book_id: bookServerId,
        category_id: cat.category_id,
        label: cat.label,
        icon: cat.icon,
        color: cat.color,
        type: cat.type,
        sort_order: cat.sort_order,
      })
      .select('id')
      .single();

    if (!error && data) {
      await db.runAsync(
        'UPDATE book_categories SET server_id = ? WHERE id = ?',
        [data.id, localCatId]
      );
    }
  }
}

export async function pushDeleteBook(serverId: string): Promise<void> {
  await supabase.from('books').delete().eq('id', serverId);
}

export async function pushDeleteTransaction(serverId: string): Promise<void> {
  await supabase.from('transactions').delete().eq('id', serverId);
}

export async function pushDeleteCategory(serverId: string): Promise<void> {
  await supabase.from('book_categories').delete().eq('id', serverId);
}

export async function pushSettings(
  userId: string,
  key: string,
  value: string
): Promise<void> {
  await supabase.from('app_settings').upsert(
    { user_id: userId, key, value },
    { onConflict: 'user_id,key' }
  );
}

// ─── Pull functions (cloud → local) ────────────────────────────────

export async function pullAllData(
  db: SQLiteDatabase,
  userId: string
): Promise<void> {
  // Check if cloud has any data
  const { data: cloudBooks } = await supabase
    .from('books')
    .select('*')
    .eq('user_id', userId);

  if (!cloudBooks || cloudBooks.length === 0) {
    // Cloud is empty — push all local data up (first-time sync)
    await pushAllLocal(db, userId);
    return;
  }

  // Cloud has data — populate local DB from cloud
  // Clear local tables (order matters for FK constraints)
  await db.execAsync('DELETE FROM transactions');
  await db.execAsync('DELETE FROM book_categories');
  await db.execAsync('DELETE FROM books');

  // Insert books
  for (const b of cloudBooks) {
    await db.runAsync(
      'INSERT INTO books (name, hobby_template, icon, color, server_id, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [b.name, b.hobby_template, b.icon, b.color, b.id, b.created_at, b.updated_at]
    );
  }

  // Pull categories
  const { data: cloudCats } = await supabase
    .from('book_categories')
    .select('*')
    .eq('user_id', userId);

  if (cloudCats) {
    for (const c of cloudCats) {
      // Find local book_id by server_id
      const localBook = await db.getFirstAsync<{ id: number }>(
        'SELECT id FROM books WHERE server_id = ?',
        [c.book_id]
      );
      if (!localBook) continue;
      await db.runAsync(
        'INSERT INTO book_categories (book_id, category_id, label, icon, color, type, sort_order, server_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
        [localBook.id, c.category_id, c.label, c.icon, c.color, c.type, c.sort_order, c.id]
      );
    }
  }

  // Pull transactions
  const { data: cloudTxs } = await supabase
    .from('transactions')
    .select('*')
    .eq('user_id', userId);

  if (cloudTxs) {
    for (const t of cloudTxs) {
      const localBook = await db.getFirstAsync<{ id: number }>(
        'SELECT id FROM books WHERE server_id = ?',
        [t.book_id]
      );
      if (!localBook) continue;
      await db.runAsync(
        'INSERT INTO transactions (type, amount, description, category, date, book_id, server_id, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [t.type, t.amount, t.description, t.category, t.date, localBook.id, t.id, t.created_at, t.updated_at]
      );
    }
  }

  // Pull settings
  const { data: cloudSettings } = await supabase
    .from('app_settings')
    .select('*')
    .eq('user_id', userId);

  if (cloudSettings) {
    for (const s of cloudSettings) {
      if (s.key === 'last_open_book_id') {
        // Translate cloud UUID to local integer ID
        const localBook = await db.getFirstAsync<{ id: number }>(
          'SELECT id FROM books WHERE server_id = ?',
          [s.value]
        );
        if (localBook) {
          await db.runAsync(
            "INSERT OR REPLACE INTO app_settings (key, value) VALUES ('last_open_book_id', ?)",
            [String(localBook.id)]
          );
        }
      } else {
        await db.runAsync(
          'INSERT OR REPLACE INTO app_settings (key, value) VALUES (?, ?)',
          [s.key, s.value]
        );
      }
    }
  }

  // Store last sync timestamp
  await db.runAsync(
    "INSERT OR REPLACE INTO app_settings (key, value) VALUES ('last_sync_at', ?)",
    [new Date().toISOString()]
  );
}

export async function pullIncremental(
  db: SQLiteDatabase,
  userId: string
): Promise<void> {
  const lastSyncRow = await db.getFirstAsync<{ value: string }>(
    "SELECT value FROM app_settings WHERE key = 'last_sync_at'"
  );
  if (!lastSyncRow) {
    // No previous sync — do a full pull
    await pullAllData(db, userId);
    return;
  }

  const lastSync = lastSyncRow.value;

  // Pull updated books
  const { data: updatedBooks } = await supabase
    .from('books')
    .select('*')
    .eq('user_id', userId)
    .gt('updated_at', lastSync);

  if (updatedBooks) {
    for (const b of updatedBooks) {
      const existing = await db.getFirstAsync<{ id: number }>(
        'SELECT id FROM books WHERE server_id = ?',
        [b.id]
      );
      if (existing) {
        await db.runAsync(
          'UPDATE books SET name = ?, hobby_template = ?, icon = ?, color = ?, updated_at = ? WHERE id = ?',
          [b.name, b.hobby_template, b.icon, b.color, b.updated_at, existing.id]
        );
      } else {
        await db.runAsync(
          'INSERT INTO books (name, hobby_template, icon, color, server_id, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?)',
          [b.name, b.hobby_template, b.icon, b.color, b.id, b.created_at, b.updated_at]
        );
      }
    }
  }

  // Pull updated transactions
  const { data: updatedTxs } = await supabase
    .from('transactions')
    .select('*')
    .eq('user_id', userId)
    .gt('updated_at', lastSync);

  if (updatedTxs) {
    for (const t of updatedTxs) {
      const localBook = await db.getFirstAsync<{ id: number }>(
        'SELECT id FROM books WHERE server_id = ?',
        [t.book_id]
      );
      if (!localBook) continue;
      const existing = await db.getFirstAsync<{ id: number }>(
        'SELECT id FROM transactions WHERE server_id = ?',
        [t.id]
      );
      if (existing) {
        await db.runAsync(
          "UPDATE transactions SET type = ?, amount = ?, description = ?, category = ?, date = ?, book_id = ?, updated_at = ? WHERE id = ?",
          [t.type, t.amount, t.description, t.category, t.date, localBook.id, t.updated_at, existing.id]
        );
      } else {
        await db.runAsync(
          'INSERT INTO transactions (type, amount, description, category, date, book_id, server_id, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
          [t.type, t.amount, t.description, t.category, t.date, localBook.id, t.id, t.created_at, t.updated_at]
        );
      }
    }
  }

  // Detect cloud deletions — remove local rows whose server_id no longer exists in cloud
  const localSyncedBooks = await db.getAllAsync<{ id: number; server_id: string }>(
    'SELECT id, server_id FROM books WHERE server_id IS NOT NULL'
  );
  if (localSyncedBooks.length > 0) {
    const serverIds = localSyncedBooks.map((b) => b.server_id);
    const { data: existingCloudBooks } = await supabase
      .from('books')
      .select('id')
      .eq('user_id', userId)
      .in('id', serverIds);
    const existingSet = new Set((existingCloudBooks ?? []).map((b) => b.id));
    for (const local of localSyncedBooks) {
      if (!existingSet.has(local.server_id)) {
        await db.runAsync('DELETE FROM transactions WHERE book_id = ?', [local.id]);
        await db.runAsync('DELETE FROM book_categories WHERE book_id = ?', [local.id]);
        await db.runAsync('DELETE FROM books WHERE id = ?', [local.id]);
      }
    }
  }

  // Update sync timestamp
  await db.runAsync(
    "INSERT OR REPLACE INTO app_settings (key, value) VALUES ('last_sync_at', ?)",
    [new Date().toISOString()]
  );
}

export async function pushAllLocal(
  db: SQLiteDatabase,
  userId: string
): Promise<void> {
  // Push all books
  const books = await db.getAllAsync<{ id: number }>(
    'SELECT id FROM books'
  );
  for (const book of books) {
    await pushBook(db, userId, book.id);
  }

  // Push all categories
  const cats = await db.getAllAsync<{ id: number }>(
    'SELECT id FROM book_categories'
  );
  for (const cat of cats) {
    await pushCategory(db, userId, cat.id);
  }

  // Push all transactions
  const txs = await db.getAllAsync<{ id: number }>(
    'SELECT id FROM transactions'
  );
  for (const tx of txs) {
    await pushTransaction(db, userId, tx.id);
  }

  // Push settings
  const settings = await db.getAllAsync<{ key: string; value: string }>(
    'SELECT key, value FROM app_settings'
  );
  for (const s of settings) {
    if (s.key === 'last_open_book_id') {
      // Translate local integer to cloud UUID
      const book = await db.getFirstAsync<{ server_id: string | null }>(
        'SELECT server_id FROM books WHERE id = ?',
        [parseInt(s.value, 10)]
      );
      if (book?.server_id) {
        await pushSettings(userId, s.key, book.server_id);
      }
    } else if (s.key !== 'last_sync_at') {
      await pushSettings(userId, s.key, s.value);
    }
  }

  // Store sync timestamp
  await db.runAsync(
    "INSERT OR REPLACE INTO app_settings (key, value) VALUES ('last_sync_at', ?)",
    [new Date().toISOString()]
  );
}
