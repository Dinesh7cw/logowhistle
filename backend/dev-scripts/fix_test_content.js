const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.join(__dirname, '.tmp', 'data.db');
const db = new Database(dbPath);

try {
  const post = db.prepare("SELECT id FROM blog_posts WHERE slug = 'non-profit-organizations-logo-design'").get();
  if (post) {
    // 1. Clear the bad content field
    db.prepare("UPDATE blog_posts SET content = '' WHERE id = ?").run(post.id);
    
    // 2. Insert into components_sections_quotes
    const quoteText = "# Why Non-Profit Logos Matter\n\nA good logo builds trust and helps in fundraising.";
    const author = "Design Expert";
    
    // check columns of components_sections_quotes
    const quoteCols = db.prepare("PRAGMA table_info(components_sections_quotes)").all().map(c => c.name);
    console.log('Quote Cols:', quoteCols);
    
    const quoteResult = db.prepare("INSERT INTO components_sections_quotes (quote_text, author, created_at, updated_at) VALUES (?, ?, ?, ?)").run(
        quoteText, author, Date.now(), Date.now()
    );
    const quoteId = quoteResult.lastInsertRowid;
    
    // 3. Link to blog_posts_cmps
    // check columns of blog_posts_cmps
    const linkCols = db.prepare("PRAGMA table_info(blog_posts_cmps)").all().map(c => c.name);
    console.log('Link Cols:', linkCols);
    
    // In Strapi, the linkage usually follows this pattern:
    // entity_id, component_id, component_type, field, order
    db.prepare("INSERT INTO blog_posts_cmps (entity_id, component_id, component_type, field, \"order\") VALUES (?, ?, ?, ?, ?)").run(
        post.id, quoteId, 'sections.quote', 'sections', 1
    );
    
    console.log('Successfully linked Quote component to blog post.');
  }
} catch (err) {
  console.error('Error:', err.message);
} finally {
  db.close();
}
