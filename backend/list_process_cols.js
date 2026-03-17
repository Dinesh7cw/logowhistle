const Database = require('better-sqlite3');
const path = require('path');
const dbPath = path.join(__dirname, '.tmp', 'data.db');
const db = new Database(dbPath);
const cols = db.prepare("PRAGMA table_info(process_pages)").all().map(c => c.name);
console.log(cols);
db.close();
