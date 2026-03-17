const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.join(__dirname, '..', '.tmp', 'data.db');
const db = new Database(dbPath);

const now = Date.now();

try {
  // The faq_pages entry exists but published_at is null — publish it
  const result = db.prepare("UPDATE faq_pages SET published_at = ?, updated_at = ? WHERE id = 1").run(now, now);
  console.log('Published faq_pages:', result.changes, 'rows updated');

  // Also make sure faq_items are published (published_at not null)
  const unpublished = db.prepare("SELECT COUNT(*) as c FROM faq_items WHERE published_at IS NULL").get();
  console.log('Unpublished faq_items:', unpublished.c);

  if (unpublished.c > 0) {
    const r2 = db.prepare("UPDATE faq_items SET published_at = ?, updated_at = ? WHERE published_at IS NULL").run(now, now);
    console.log('Published faq_items:', r2.changes, 'rows updated');
  }

} catch (e) {
  console.error('Error:', e.message);
} finally {
  db.close();
}
