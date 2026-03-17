const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.join(__dirname, '.tmp', 'data.db');
const db = new Database(dbPath);

try {
  const tables = db.prepare("SELECT name FROM sqlite_master WHERE type='table'").all().map(t => t.name);
  console.log('--- ALL TABLES ---');
  console.log(tables.join(', '));

  console.log('\n--- HOMEPAGE SECTIONS LINK ---');
  // Check common Strapi 5 dynamic zone link table pattern
  const hpLnk = tables.find(t => t.includes('homepages_sections_lnk') || t.includes('homepage_sections_lnk'));
  if (hpLnk) {
    console.log(`Contents of ${hpLnk}:`);
    console.log(db.prepare(`SELECT * FROM ${hpLnk}`).all());
  } else {
    console.log('No homepage sections link table found with expected name.');
  }

  console.log('\n--- FAQ PAGE STATUS ---');
  const faqPage = db.prepare("SELECT * FROM faq_pages").get();
  console.log(faqPage);

  console.log('\n--- HOMEPAGE STATUS ---');
  const homePage = db.prepare("SELECT * FROM homepages").get();
  console.log(homePage);

} catch (e) {
  console.error('Error:', e.message);
} finally {
  db.close();
}
