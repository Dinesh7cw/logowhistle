const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.join(__dirname, '.tmp', 'data.db');
const db = new Database(dbPath);

const tables = [
  'admin_users',
  'up_users',
  'strapi_migrations',
  'blog_posts',
  'blog_posts_cmps',
  'homepages',
  'globals',
  'strapi_database_schema'
];

console.log('--- Row Counts ---');
tables.forEach(table => {
  try {
    const count = db.prepare(`SELECT COUNT(*) as count FROM ${table}`).get().count;
    console.log(`${table}: ${count}`);
  } catch (err) {
    console.log(`${table}: Error or table not found`);
  }
});

console.log('\n--- Admin Users ---');
try {
  const users = db.prepare('SELECT id, username, email FROM admin_users').all();
  console.log(users);
} catch (e) {
  console.log('Error fetching admin users');
}

db.close();
