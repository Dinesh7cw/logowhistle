const Database = require('better-sqlite3');
const path = require('path');
const dbPath = path.join(__dirname, '.tmp', 'data.db');
const db = new Database(dbPath);

const tables = ['pricing_pages', 'process_pages', 'faq_items', 'blog_posts', 'portfolio_items', 'blog_pages', 'contact_pages', 'homepages', 'globals'];

tables.forEach(table => {
  try {
    const rows = db.prepare(`SELECT id, published_at, created_at, updated_at FROM ${table}`).all();
    rows.forEach(row => {
      const updates = [];
      const values = [];

      ['published_at', 'created_at', 'updated_at'].forEach(field => {
        if (row[field] && typeof row[field] === 'number') {
          updates.push(`${field} = ?`);
          values.push(new Date(row[field]).toISOString());
        }
      });

      if (updates.length > 0) {
        db.prepare(`UPDATE ${table} SET ${updates.join(', ')} WHERE id = ?`).run(...values, row.id);
      }
    });
    console.log(`Updated dates for ${table}`);
  } catch (err) {
    if (err.message.includes('no such table')) {
        // ignore
    } else {
        console.log(`Error updating ${table}:`, err.message);
    }
  }
});

db.close();
