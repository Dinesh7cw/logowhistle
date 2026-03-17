const { DatabaseSync } = require('node:sqlite');
const db = new DatabaseSync('.tmp/data.db');

// List tables
const tables = db.prepare(`SELECT name FROM sqlite_master WHERE type='table' AND name LIKE 'up_%'`).all();
console.log('Tables:', tables.map(t => t.name));

// We need to add upload permission to Public role
const role = db.prepare(`SELECT id, document_id FROM up_roles WHERE type = 'public'`).get();
if (role) {
  console.log('Public role:', role);
  
  // See permissions table
  const perms = db.prepare(`PRAGMA table_info(up_permissions)`).all();
  console.log('Permissions columns:', perms.map(p => p.name));
  
  // See what the link table is
  const links = tables.find(t => t.name.includes('permissions_role'));
  if (links) {
     console.log('Link table:', links.name);
     const linkCols = db.prepare(`PRAGMA table_info(${links.name})`).all();
     console.log('Link columns:', linkCols.map(p => p.name));
     
     // 1. Insert permission
     const permRes = db.prepare(`INSERT INTO up_permissions (action, created_at, updated_at) VALUES (?, datetime('now'), datetime('now'))`).run('plugin::upload.content-api.upload');
     console.log('Inserted perm:', permRes.lastInsertRowid);
     
     // 2. Link to role
     db.prepare(`INSERT INTO ${links.name} (permission_id, role_id) VALUES (?, ?)`).run(permRes.lastInsertRowid, role.id);
     console.log('Linked to role!');
  }
}
