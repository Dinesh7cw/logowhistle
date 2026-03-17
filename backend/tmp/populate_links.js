const BetterSqlite3 = require('better-sqlite3');
const path = require('path');

const dbPath = path.join(__dirname, '..', '.tmp', 'data.db');
const db = new BetterSqlite3(dbPath);

try {
  const globalRow = db.prepare('SELECT * FROM globals LIMIT 1').get();
  
  if (globalRow) {
    console.log('Found existing Global entry. Updating with help links...');
    
    // Naming convention found in DB: help_link_1_text
    const updates = {
      help_link_1_text: "Need a Web Design?",
      help_link_1_url: "/web-design",
      help_link_2_text: "Looking for Website Maintenance Services?",
      help_link_2_url: "/website-maintenance",
      help_link_3_text: "Looking for Small Business Website Services?",
      help_link_3_url: "/small-business",
      help_link_4_text: "Looking for 3D Configurators?",
      help_link_4_url: "/3d-configurators"
    };

    const columnsToUpdate = Object.keys(updates);
    const setClause = columnsToUpdate.map(c => `${c} = ?`).join(', ');
    const values = columnsToUpdate.map(c => updates[c]);
    
    const updateStmt = db.prepare(`UPDATE globals SET ${setClause} WHERE id = ?`);
    updateStmt.run(...values, globalRow.id);
    
    console.log('Successfully updated Global entries with correct help links!');
  } else {
    console.log('No Global entry found to update.');
  }
} catch (error) {
  console.error('Error updating database:', error);
} finally {
  db.close();
}
