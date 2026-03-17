const Database = require('better-sqlite3');
const dbPath = 'd:/logowhistle/logowhistle-clone/backend/.tmp/data.db';

const db = new Database(dbPath);

const posts = db.prepare("SELECT id, title, slug FROM blog_posts").all();
console.log(JSON.stringify(posts, null, 2));
