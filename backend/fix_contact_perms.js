const Database = require('better-sqlite3');
const db = new Database('d:/logowhistle/logowhistle-clone/backend/.tmp/data.db');

try {
  const publicRole = db.prepare("SELECT id FROM up_roles WHERE type = 'public'").get();
  
  if (publicRole) {
    const actions = [
      'api::contact-page.contact-page.find',
      'api::contact-inquiry.contact-inquiry.create'
    ];

    for (const action of actions) {
      // 1. Ensure permission exists in up_permissions
      let perm = db.prepare('SELECT id FROM up_permissions WHERE action = ?').get(action);
      
      if (!perm) {
        const result = db.prepare('INSERT INTO up_permissions (action, created_at, updated_at, published_at) VALUES (?, ?, ?, ?)').run(
          action, 
          Date.now(), 
          Date.now(), 
          Date.now()
        );
        perm = { id: result.lastInsertRowid };
        console.log(`Created permission record: ${action}`);
      }

      // 2. Link permission to public role in up_permissions_role_lnk
      const linkExists = db.prepare('SELECT id FROM up_permissions_role_lnk WHERE permission_id = ? AND role_id = ?').get(perm.id, publicRole.id);
      
      if (!linkExists) {
        db.prepare('INSERT INTO up_permissions_role_lnk (permission_id, role_id) VALUES (?, ?)').run(perm.id, publicRole.id);
        console.log(`Linked ${action} to Public role`);
      } else {
        console.log(`Permission ${action} already linked to Public role`);
      }
    }
  } else {
    console.log('Public role not found');
  }
} catch (err) {
  console.error('Error updating permissions:', err);
} finally {
  db.close();
}
