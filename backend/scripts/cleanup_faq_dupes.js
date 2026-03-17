const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.join(__dirname, '..', '.tmp', 'data.db');
const db = new Database(dbPath);

try {
  // Show all items grouped by question to see duplicates
  const all = db.prepare("SELECT id, question, display_order FROM faq_items ORDER BY question, id").all();
  console.log('All items:');
  all.forEach(r => console.log(`  id=${r.id} order=${r.display_order} q="${r.question.substring(0, 60)}..."`));
  
  console.log('\nTotal:', all.length);

  // Delete the newer duplicates (ids 12-22) keeping the originals (1-11)
  const result = db.prepare("DELETE FROM faq_items WHERE id >= 12").run();
  console.log('\nDeleted', result.changes, 'duplicate items');
  
  const remaining = db.prepare("SELECT COUNT(*) as c FROM faq_items").get();
  console.log('Remaining items:', remaining.c);

} catch (e) {
  console.error('Error:', e.message);
} finally {
  db.close();
}
