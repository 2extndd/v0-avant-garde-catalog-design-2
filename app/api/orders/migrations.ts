import { prisma } from '@/lib/prisma'

/**
 * Best-effort schema initialization for orders tables.
 * We keep it in code because Prisma schema in this repo is used only for client generation,
 * while the actual SQLite DB is shared with the bot.
 */
export async function ensureOrdersSchema(): Promise<void> {
  // Create tables if missing
  // NOTE: SQLite supports IF NOT EXISTS, and RETURNING requires SQLite >= 3.35.
  await prisma.$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS orders (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      buyer_telegram TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'NEW',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `)

  await prisma.$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS order_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      order_id INTEGER NOT NULL,
      product_id INTEGER NOT NULL,
      qty INTEGER NOT NULL DEFAULT 1,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `)

  await prisma.$executeRawUnsafe(`
    CREATE INDEX IF NOT EXISTS idx_orders_user_id_created_at ON orders(user_id, created_at);
  `)
  await prisma.$executeRawUnsafe(`
    CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);
  `)
}
