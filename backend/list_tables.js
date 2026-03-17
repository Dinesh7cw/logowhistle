const Database = require('better-sqlite3');
const dbPath = 'd:/logowhistle/logowhistle-clone/backend/.tmp/data.db';

const db = new Database(dbPath);

const tables = db.prepare("SELECT name FROM sqlite_master WHERE type='table'").all();
console.log(JSON.stringify(tables, null, 2));
