const Database = require('better-sqlite3');
const path = require('path');
const crypto = require('crypto');

const dbPath = path.join(__dirname, '..', '.tmp', 'data.db');
const db = new Database(dbPath);

const now = Date.now();

function grantPermission(action) {
  try {
    // Check if permission already exists
    const existing = db.prepare("SELECT id FROM up_permissions WHERE action = ?").get(action);
    if (existing) {
      console.log(`Permission ${action} already exists with id ${existing.id}`);
      // Ensure it's linked to public role (2)
      const linked = db.prepare("SELECT id FROM up_permissions_role_lnk WHERE permission_id = ? AND role_id = 2").get(existing.id);
      if (!linked) {
        const maxOrd = db.prepare("SELECT MAX(permission_ord) as m FROM up_permissions_role_lnk WHERE role_id = 2").get();
        const nextOrd = (maxOrd.m || 0) + 1;
        db.prepare("INSERT INTO up_permissions_role_lnk (permission_id, role_id, permission_ord) VALUES (?, 2, ?)").run(existing.id, nextOrd);
        console.log(`Linked existing permission ${action} to Public role.`);
      }
      return;
    }

    const docId = crypto.randomBytes(12).toString('hex');
    const result = db.prepare(`
      INSERT INTO up_permissions (document_id, action, created_at, updated_at, published_at)
      VALUES (?, ?, ?, ?, ?)
    `).run(docId, action, now, now, now);
    
    const newPermId = result.lastInsertRowid;
    const maxOrd = db.prepare("SELECT MAX(permission_ord) as m FROM up_permissions_role_lnk WHERE role_id = 2").get();
    const nextOrd = (maxOrd.m || 0) + 1;

    db.prepare(`
      INSERT INTO up_permissions_role_lnk (permission_id, role_id, permission_ord)
      VALUES (?, 2, ?)
    `).run(newPermId, nextOrd);

    console.log(`Granted ${action} to Public role.`);
  } catch (e) {
    console.error(`Failed to grant ${action}:`, e.message);
  }
}

grantPermission('api::faq-page.faq-page.find');
grantPermission('api::faq-item.faq-item.find');

db.close();
