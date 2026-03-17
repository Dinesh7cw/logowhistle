const fetch = require('node-fetch');

async function testFetch(label, query) {
  const url = `http://localhost:1337/api/pricing-page${query}`;
  console.log(`--- ${label} ---`);
  try {
    const res = await fetch(url);
    const json = await res.json();
    if (!res.ok) {
        console.error(`FAILED (${res.status}):`, JSON.stringify(json, null, 2));
    } else {
        console.log(`SUCCESS:`);
        if (json.data && json.data.pricingTiers) {
           console.log('pricingTiers:', JSON.stringify(json.data.pricingTiers, null, 2));
        } else {
           console.log('pricingTiers field MISSING or NULL');
        }
    }
  } catch (e) {
    console.error(`FETCH ERROR: ${e.message}`);
  }
}

async function run() {
  await testFetch('Populate All Only', '?populate=*');
}

run();
