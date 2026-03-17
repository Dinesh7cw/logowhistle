const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.join(__dirname, '.tmp', 'data.db');
const db = new Database(dbPath);

const tables = [
  'blog_posts',
  'portfolio_items',
  'faq_items',
  'homepages',
  'globals',
  'blog_pages',
  'contact_pages',
  'process_pages',
  'pricing_pages',
  'files'
];

console.log('--- Table Row Counts ---');
tables.forEach(table => {
  try {
    const count = db.prepare(`SELECT COUNT(*) as count FROM ${table}`).get().count;
    console.log(`${table}: ${count}`);
  } catch (err) {
    console.log(`${table}: Error or table not found`);
  }
});
db.close();
