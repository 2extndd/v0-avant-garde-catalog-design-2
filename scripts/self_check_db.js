// Self-check: verifies Prisma can access the DB and lists recent slugs.
// Usage:
//   export $(grep -v '^#' .env | xargs)
//   node scripts/self_check_db.js

const { PrismaClient } = require('@prisma/client');

(async () => {
  const prisma = new PrismaClient();
  try {
    const rows = await prisma.$queryRawUnsafe(
      'SELECT id, site_slug, is_registered FROM users ORDER BY id DESC LIMIT 5'
    );
    console.log(rows);
  } finally {
    await prisma.$disconnect();
  }
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
