const BetterSqlite3 = require('better-sqlite3');
const path = require('path');

const dbPath = path.resolve(process.cwd(), '.tmp/data.db');
const db = new BetterSqlite3(dbPath);

try {
  const info = db.prepare("PRAGMA table_info(pricing_pages_cmps)").all();
  console.log('Columns:', JSON.stringify(info, null, 2));
} catch (e) {
  console.error(e);
} finally {
  db.close();
}
