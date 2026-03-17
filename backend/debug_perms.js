const Database = require('better-sqlite3');
const db = new Database('d:/logowhistle/logowhistle-clone/backend/.tmp/data.db');

try {
  const publicRole = db.prepare("SELECT * FROM up_roles WHERE type = 'public'").get();
  console.log('Public Role:', JSON.stringify(publicRole, null, 2));

  const permissions = db.prepare("SELECT * FROM up_permissions WHERE action LIKE 'api::contact%'").all();
  console.log('Permissions:', JSON.stringify(permissions, null, 2));

  if (publicRole && permissions.length > 0) {
    const permIds = permissions.map(p => p.id);
    const links = db.prepare(`SELECT * FROM up_permissions_role_lnk WHERE role_id = ?`).all(publicRole.id);
    console.log('Role Links:', JSON.stringify(links, null, 2));
  }
} catch (err) {
  console.error('Error:', err);
} finally {
  db.close();
}
