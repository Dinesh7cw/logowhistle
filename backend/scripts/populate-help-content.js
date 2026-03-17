const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.join(__dirname, '..', '.tmp', 'data.db');
const db = new Database(dbPath);

const helpText1 = "For a quicker turnaround time, let us know the best way to contact you";
const helpText2 = "If you have a preliminary idea for your logo, whether it’s described in words or sketched out, rest assured that our custom logo design company will bring it to life.";
const helpText3 = "Logos are almost always the first aspect of your business to grab customers’ attention. Getting a logo-design job well done is all about effective communication. Help us understand your preferances in colors and patterns to get the output you desire. And get best logo design services from us.";

try {
  const columns = db.prepare("PRAGMA table_info(process_pages)").all();
  const columnNames = columns.map(c => c.name);

  // We only care about text fields now since icons are media (handled via links)
  const requiredColumns = ['help_row_1_text', 'help_row_2_text', 'help_row_3_text'];
  const missing = requiredColumns.filter(c => !columnNames.includes(c));

  if (missing.length > 0) {
    for (const col of missing) {
      db.prepare(`ALTER TABLE process_pages ADD COLUMN ${col} TEXT`).run();
    }
  }

  const result = db.prepare(`
    UPDATE process_pages 
    SET help_row_1_text = ?, 
        help_row_2_text = ?, 
        help_row_3_text = ?
    WHERE id = 1
  `).run(helpText1, helpText2, helpText3);

  console.log("Updated process_pages text content successfully.", result);
} catch (error) {
  console.error("Error updating database:", error);
} finally {
  db.close();
}
