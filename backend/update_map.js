const Database = require('better-sqlite3');
const db = new Database('d:/logowhistle/logowhistle-clone/backend/.tmp/data.db');

try {
  const mapIframe = '<iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3915.9392!2d76.974!3d11.03!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTHCsDAxJzQ4LjAiTiA3Nis1OCcyNi40IkU!5e0!3m2!1sen!2sin!4v1620000000000!5m2!1sen!2sin" width="100%" height="100%" style="border:0;" allowfullscreen="" loading="lazy"></iframe>';
  const result = db.prepare('UPDATE contact_pages SET map_iframe = ?').run(mapIframe);
  console.log('Updated Map Iframe. Rows modified:', result.changes);
} catch (err) {
  console.error('Error:', err);
} finally {
  db.close();
}
