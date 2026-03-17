const Database = require('better-sqlite3');
const dbPath = 'd:/logowhistle/logowhistle-clone/backend/.tmp/data.db';

const db = new Database(dbPath);

const rowCount = db.prepare("SELECT COUNT(*) as count FROM blog_posts_cmps WHERE entity_id = 35").get();
console.log(`Remaining component links for ID 35: ${rowCount.count}`);

const allLinks = db.prepare("SELECT * FROM blog_posts_cmps LIMIT 10").all();
console.log("Sample links:", JSON.stringify(allLinks, null, 2));
