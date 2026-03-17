const Database = require('better-sqlite3');
const dbPath = 'd:/logowhistle/logowhistle-clone/backend/.tmp/data.db';

const db = new Database(dbPath);

const tables = ['blog_posts_cmps', 'blog_pages_cmps', 'homepages_cmps', 'portfolio_pages_cmps'];

for (const t of tables) {
  try {
    const count = db.prepare(`SELECT COUNT(*) as count FROM ${t}`).get();
    console.log(`${t} count: ${count.count}`);
  } catch (e) {
    console.log(`${t} error: ${e.message}`);
  }
}

const blogs = db.prepare("SELECT id, title, slug FROM blog_posts").all();
console.log("All blog posts:", JSON.stringify(blogs, null, 2));
