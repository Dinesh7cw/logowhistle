
const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.join(__dirname, '.tmp', 'data.db');
const db = new Database(dbPath);

try {
    console.log('Checking tables...');
    const tables = db.prepare("SELECT name FROM sqlite_master WHERE type='table'").all();
    console.log('Tables:', tables.map(t => t.name).join(', '));

    const homepageTable = tables.find(t => t.name.includes('homepages'))?.name;
    const globalTable = tables.find(t => t.name.includes('globals'))?.name;
    const coreStoreTable = tables.find(t => t.name.includes('strapi_core_store_settings'))?.name || 'strapi_core_store_settings';

    if (homepageTable && globalTable) {
        console.log(`Migrating data from ${homepageTable} to ${globalTable}...`);
        
        const homepage = db.prepare(`SELECT * FROM ${homepageTable} LIMIT 1`).get();
        if (homepage) {
            console.log('Homepage data found:', homepage);
            
            // Check global table columns
            const globalCols = db.prepare(`PRAGMA table_info(${globalTable})`).all().map(c => c.name);
            console.log('Global columns:', globalCols);

            const updateFields = [];
            const values = [];

            const mapping = {
                cta_section_title: 'ctaSectionTitle',
                cta_section_description: 'ctaSectionDescription',
                cta_button_label: 'ctaButtonLabel',
                cta_button_url: 'ctaButtonUrl'
            };

            // In Strapi, columns might be snake_case or camelCase depending on version/config
            // Let's find the match
            for (const [homepageKey, globalKey] of Object.entries(mapping)) {
                // Find actual column names in tables
                const hCol = Object.keys(homepage).find(k => k.toLowerCase() === homepageKey.replace(/_/g, '').toLowerCase() || k.toLowerCase() === homepageKey.toLowerCase());
                const gCol = globalCols.find(k => k.toLowerCase() === globalKey.toLowerCase() || k.toLowerCase() === globalKey.replace(/([A-Z])/g, '_$1').toLowerCase());

                if (hCol && gCol) {
                    updateFields.push(`${gCol} = ?`);
                    values.push(homepage[hCol]);
                }
            }

            if (updateFields.length > 0) {
                const globalEntry = db.prepare(`SELECT id FROM ${globalTable} LIMIT 1`).get();
                if (globalEntry) {
                    const sql = `UPDATE ${globalTable} SET ${updateFields.join(', ')} WHERE id = ${globalEntry.id}`;
                    db.prepare(sql).run(...values);
                    console.log('Global entry updated.');
                } else {
                    const cols = updateFields.map(f => f.split(' =')[0]);
                    const sql = `INSERT INTO ${globalTable} (${cols.join(', ')}) VALUES (${cols.map(() => '?').join(', ')})`;
                    db.prepare(sql).run(...values);
                    console.log('Global entry created.');
                }
            }
        }
    }

    console.log('Resetting Content Manager configuration...');
    // Delete the configuration that might refer to old fields
    db.prepare(`DELETE FROM ${coreStoreTable} WHERE key LIKE 'plugin_content_manager_configuration_content_types::api::homepage.homepage'`).run();
    console.log('Configuration deleted.');

} catch (e) {
    console.error('Migration failed:', e);
} finally {
    db.close();
}
