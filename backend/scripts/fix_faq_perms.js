const Database = require('better-sqlite3');
const path = require('path');
const crypto = require('crypto');

const dbPath = path.join(__dirname, '..', '.tmp', 'data.db');
const db = new Database(dbPath);

const now = Date.now();

try {
  // Insert faq-page find permission
  const docId = crypto.randomBytes(12).toString('hex');
  
  const insert = db.prepare(`
    INSERT INTO up_permissions (document_id, action, created_at, updated_at, published_at)
    VALUES (?, ?, ?, ?, ?)
  `);
  
  const result = insert.run(docId, 'api::faq-page.faq-page.find', now, now, now);
  const newPermId = result.lastInsertRowid;
  console.log('Inserted permission id:', newPermId);

  // Get current max permission_ord for role 2
  const maxOrd = db.prepare("SELECT MAX(permission_ord) as m FROM up_permissions_role_lnk WHERE role_id = 2").get();
  const nextOrd = (maxOrd.m || 0) + 1;

  // Link to public role (id=2)
  const link = db.prepare(`
    INSERT INTO up_permissions_role_lnk (permission_id, role_id, permission_ord)
    VALUES (?, 2, ?)
  `);
  link.run(newPermId, nextOrd);
  console.log('Linked permission to Public role. Done!');

  // Also populate faq_pages table with hero content
  // Check if faq_pages table has content
  const existing = db.prepare("SELECT * FROM faq_pages LIMIT 1").get();
  console.log('Existing faq_pages entry:', existing);

  if (!existing) {
    const fpDocId = crypto.randomBytes(12).toString('hex');
    db.prepare(`
      INSERT INTO faq_pages (document_id, hero_headline, hero_subheadline, created_at, updated_at, published_at)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(fpDocId, 'Logo Design FAQs', 'Get the Answers You Need Before You Start Your Project', now, now, now);
    console.log('Created faq_pages entry!');
  } else {
    // Check columns
    const cols = db.prepare("PRAGMA table_info(faq_pages)").all();
    console.log('faq_pages columns:', cols.map(c => c.name).join(', '));
  }

} catch (e) {
  console.error('Error:', e.message);
} finally {
  db.close();
}
