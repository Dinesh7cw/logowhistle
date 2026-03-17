const Database = require('better-sqlite3');
const db = new Database('d:/logowhistle/logowhistle-clone/backend/.tmp/data.db');

try {
  const perms = db.prepare("SELECT * FROM up_permissions").all();
  const contactInquiryPerms = perms.filter(p => p.action.includes('contact-inquiry'));
  console.log('Contact Inquiry Permissions:', JSON.stringify(contactInquiryPerms, null, 2));
} catch (err) {
  console.error('Error:', err);
} finally {
  db.close();
}
