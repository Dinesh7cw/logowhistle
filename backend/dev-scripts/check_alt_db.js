const Database = require('better-sqlite3');

const dbPath = 'd:/case-studies/backend/.tmp/data.db';
const db = new Database(dbPath);

const tables = [
  'blog_posts',
  'portfolio_items',
  'faq_items',
  'homepages',
  'globals'
];

console.log('--- Table Row Counts (case-studies) ---');
tables.forEach(table => {
  try {
    const count = db.prepare(`SELECT COUNT(*) as count FROM ${table}`).get().count;
    console.log(`${table}: ${count}`);
  } catch (err) {
    console.log(`${table}: Error or table not found`);
  }
});
db.close();
