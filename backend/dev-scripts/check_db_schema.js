const Database = require('better-sqlite3');
const db = new Database('d:/logowhistle/logowhistle-clone/backend/.tmp/data.db');

try {
  const info = db.prepare("PRAGMA table_info(up_permissions)").all();
  console.log('Table Info:', JSON.stringify(info, null, 2));
  
  const permissions = db.prepare("SELECT * FROM up_permissions LIMIT 1").all();
  console.log('Sample Permission:', JSON.stringify(permissions, null, 2));
} catch (err) {
  console.error('Error:', err);
} finally {
  db.close();
}
