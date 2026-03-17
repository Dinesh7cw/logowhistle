const Database = require('better-sqlite3');
const dbPath = 'd:/logowhistle/logowhistle-clone/backend/.tmp/data.db';

const db = new Database(dbPath);

const info = db.prepare("PRAGMA table_info(blog_posts)").all();
console.log("blog_posts columns:", JSON.stringify(info, null, 2));

const post = db.prepare("SELECT * FROM blog_posts WHERE id = 35").get();
console.log("Post 35 data:", JSON.stringify(post, null, 2));
