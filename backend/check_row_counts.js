const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.join(__dirname, '.tmp', 'data.db');
const db = new Database(dbPath);

const tables = [
  'blog_posts',
  'homepages',
  'portfolio_items',
  'faq_items',
  'blog_pages',
  'contact_pages',
  'process_pages',
  'globals'
];

console.log('--- Row Counts ---');
tables.forEach(table => {
  try {
    const count = db.prepare(`SELECT COUNT(*) as count FROM ${table}`).get().count;
    console.log(`${table}: ${count}`);
  } catch (err) {
    console.log(`${table}: Error or table not found`);
  }
});
db.close();
