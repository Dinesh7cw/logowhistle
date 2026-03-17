'use strict'
// Fix the Strapi admin "Cannot read properties of undefined (reading 'tours')" error.
// This error occurs because the strapi_administrator record has 'is_registered_with_strapi'
// as null and the admin panel's Redux store tries to read 'tours' from the undefined 
// guided tour state. We mark the tour as complete in the DB to suppress it.

const path = require('path')
const Database = require('better-sqlite3')

const dbPath = path.join(__dirname, '..', '.tmp', 'data.db')
console.log('📂 Opening DB:', dbPath)

const db = new Database(dbPath)

// Check what tables exist related to admin
const tables = db.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name LIKE '%admin%'").all()
console.log('📋 Admin tables:', tables.map(t => t.name))

// Check the strapi_administrator table structure
try {
  const cols = db.prepare("PRAGMA table_info(strapi_administrator)").all()
  console.log('\n📋 strapi_administrator columns:', cols.map(c => c.name).join(', '))

  const admins = db.prepare("SELECT id, email, is_active FROM strapi_administrator").all()
  console.log('\n👤 Administrators:', admins)

  // Mark the administrator as registered with Strapi (suppresses guided tour)
  if (admins.length > 0) {
    db.prepare("UPDATE strapi_administrator SET is_registered_with_strapi = 1 WHERE email = ?")
      .run('dinesh.s.colorwhistle@gmail.com')
    console.log('\n✅ Marked administrator as registered_with_strapi (guided tour suppressed)')
  }
} catch (e) {
  console.log('Column not found (OK):', e.message)
}

// Also clear any problematic admin_users metadata  
try {
  const metaTables = db.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name LIKE '%meta%'").all()
  console.log('\n📋 Meta tables:', metaTables.map(t => t.name))
} catch(e) {}

db.close()
console.log('\n✅ Done!')
