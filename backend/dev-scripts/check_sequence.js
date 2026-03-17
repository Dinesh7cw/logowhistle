const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.join(__dirname, '.tmp', 'data.db');
const db = new Database(dbPath);

console.log('--- SQLite Sequence ---');
try {
  const rows = db.prepare('SELECT * FROM sqlite_sequence').all();
  console.log(rows);
} catch (err) {
  console.log('Error or table not found');
}
db.close();
