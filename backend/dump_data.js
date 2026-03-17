const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.join(__dirname, '.tmp', 'data.db');
const db = new Database(dbPath);

const tables = [
  'i18n_locale',
  'files',
  'blog_posts',
  'homepages'
];

console.log('--- Table Dumps ---');
tables.forEach(table => {
  try {
    const rows = db.prepare(`SELECT * FROM ${table} LIMIT 5`).all();
    console.log(`\nTable: ${table} (Count: ${rows.length})`);
    console.log(rows);
  } catch (err) {
    console.log(`\nTable: ${table} - Error or not found`);
  }
});

db.close();
