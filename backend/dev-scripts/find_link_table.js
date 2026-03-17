const Database = require('better-sqlite3');
const db = new Database('d:/logowhistle/logowhistle-clone/backend/.tmp/data.db');

try {
  const tables = db.prepare("SELECT name FROM sqlite_master WHERE type='table'").all();
  console.log('Tables:', tables.map(t => t.name).join(', '));
  
  // Look for the links table
  const linkTable = tables.find(t => t.name.includes('permissions') && t.name.includes('role') && t.name.includes('links'));
  console.log('Detected Link Table:', linkTable);

  if (linkTable) {
    const info = db.prepare(`PRAGMA table_info(${linkTable.name})`).all();
    console.log('Link Table Info:', JSON.stringify(info, null, 2));
  }
} catch (err) {
  console.error('Error:', err);
} finally {
  db.close();
}
