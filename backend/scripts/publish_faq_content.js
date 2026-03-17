const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.join(__dirname, '..', '.tmp', 'data.db');
const db = new Database(dbPath);

const now = Date.now();

try {
  // Publish FAQ Page
  db.prepare("UPDATE faq_pages SET published_at = ? WHERE published_at IS NULL").run(now);
  console.log('Published FAQ Page');

  // Publish FAQ Items
  db.prepare("UPDATE faq_items SET published_at = ? WHERE published_at IS NULL").run(now);
  console.log('Published all FAQ Items');

} catch (e) {
  console.error('Failed to publish:', e.message);
} finally {
  db.close();
}
