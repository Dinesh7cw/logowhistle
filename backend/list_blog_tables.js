const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.join(__dirname, '.tmp', 'data.db');
const db = new Database(dbPath);

console.log('--- Blog Post Related Tables ---');
try {
  const tables = db.prepare("SELECT name FROM sqlite_master WHERE type='table'").all();
  const blogTables = tables.filter(t => t.name.includes('blog_posts') || t.name.includes('components'));
  console.log(blogTables.map(t => t.name));
} catch (err) {
  console.log('Error listing tables:', err.message);
}
db.close();
