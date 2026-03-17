const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.join(__dirname, '..', '.tmp', 'data.db');
const db = new Database(dbPath);

try {
  // Check link table structure
  const lnkCols = db.prepare("PRAGMA table_info(up_permissions_role_lnk)").all();
  console.log('up_permissions_role_lnk columns:', lnkCols.map(c => c.name).join(', '));

  // Check what's linked to Public role (id=2)
  const linked = db.prepare("SELECT * FROM up_permissions_role_lnk WHERE role_id = 2").all();
  console.log('Permissions linked to Public role count:', linked.length);

  // Check if faq-item find permission (id=164) is linked
  const faqItemLink = db.prepare("SELECT * FROM up_permissions_role_lnk WHERE permission_id IN (164,165)").all();
  console.log('faq-item find/findOne linked:', JSON.stringify(faqItemLink, null, 2));

  // Check if faq-page permission exists
  const faqPage = db.prepare("SELECT * FROM up_permissions WHERE action LIKE '%faq-page%'").all();
  console.log('faq-page permissions:', JSON.stringify(faqPage, null, 2));

} catch (e) {
  console.error('Error:', e.message);
} finally {
  db.close();
}
