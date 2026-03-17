const Database = require('better-sqlite3');
const path = require('path');
const dbPath = path.join(__dirname, '.tmp', 'data.db');
const db = new Database(dbPath);

const tables = ['pricing_pages', 'process_pages', 'faq_items'];

tables.forEach(table => {
  console.log(`--- ${table} ---`);
  try {
    const row = db.prepare(`SELECT id, document_id, published_at FROM ${table} LIMIT 1`).get();
    console.log(row);
  } catch (err) {
    console.log(`Error reading ${table}:`, err.message);
  }
});

db.close();
