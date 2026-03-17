
const { createStrapi } = require('@strapi/strapi');

async function migrate() {
  const app = await createStrapi().load();
  
  try {
    console.log('Fetching Homepage data...');
    // In Strapi 5, single types often have separate tables.
    // Let's use the DB query
    const homepage = await app.db.query('api::homepage.homepage').findOne();
    
    if (homepage) {
      console.log('Found Homepage entry. Migrating data to Global...');
      
      const global = await app.db.query('api::global.global').findOne();
      
      const updateData = {
        ctaSectionTitle: homepage.ctaSectionTitle,
        ctaSectionDescription: homepage.ctaSectionDescription,
        ctaButtonLabel: homepage.ctaButtonLabel,
        ctaButtonUrl: homepage.ctaButtonUrl,
      };

      if (global) {
        await app.db.query('api::global.global').update({
          where: { id: global.id },
          data: updateData
        });
        console.log('Global settings updated.');
      } else {
        await app.db.query('api::global.global').create({
          data: updateData
        });
        console.log('Global settings created.');
      }
    } else {
      console.log('No Homepage entry found.');
    }

    // Reset Content Manager configuration for Homepage
    console.log('Resetting Homepage content-manager configuration...');
    // The table is usually strapi_core_store_settings or similar.
    // Entity service/query might not expose it easily.
    // Let's use direct SQL for this specific reset if DB query fails.
    try {
        await app.db.query('strapi::core-store').delete({
            where: { key: 'plugin_content_manager_configuration_content_types::api::homepage.homepage' }
        });
        console.log('Configuration reset.');
    } catch (e) {
        console.log('Configuration reset via query failed, ignoring...');
    }

  } catch (error) {
    console.error('Migration failed:', error);
  } finally {
    process.exit(0);
  }
}

migrate();
