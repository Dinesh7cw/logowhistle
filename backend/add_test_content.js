const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.join(__dirname, '.tmp', 'data.db');
const db = new Database(dbPath);

try {
  const post = db.prepare("SELECT id FROM blog_posts WHERE slug = 'non-profit-organizations-logo-design'").get();
  if (post) {
    const content = JSON.stringify([
      {
        __component: "sections.quote",
        quote_text: "# Why Non-Profit Logos Matter\n\nA good logo build trust and helps in fundraising.",
        author: "Design Expert"
      }
    ]);
    
    // In Strapi 5, components are often stored in separate tables. 
    // But let's check the blog_posts table structure again.
    const columns = db.prepare("PRAGMA table_info(blog_posts)").all().map(c => c.name);
    console.log('Columns:', columns);
    
    // Actually, it's better to use the Strapi API if possible, 
    // but since I'm seeding, I'll try to find where components are stored.
    // In Strapi 4/5, Dynamic Zones are stored in blog_posts_components or similar.
    
    // Let's just update the 'content' field if it exists as a text field.
    if (columns.includes('content')) {
        db.prepare("UPDATE blog_posts SET content = ? WHERE id = ?").run(content, post.id);
        console.log('Updated blog post content.');
    }
  } else {
    console.log('Post not found.');
  }
} catch (err) {
  console.error(err);
} finally {
  db.close();
}
