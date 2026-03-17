const fetch = require('node-fetch');

async function testFetch(label, query) {
  const url = `http://localhost:1337/api/pricing-page${query}`;
  console.log(`--- ${label} ---`);
  console.log(`URL: ${url}`);
  try {
    const res = await fetch(url);
    const json = await res.json();
    if (!res.ok) {
        console.error(`FAILED (${res.status}):`, JSON.stringify(json, null, 2));
    } else {
        console.log(`SUCCESS:`, JSON.stringify(json, null, 2).substring(0, 100) + '...');
    }
  } catch (e) {
    console.error(`FETCH ERROR: ${e.message}`);
  }
}

async function run() {
  await testFetch('Basic', '');
  await testFetch('Populate All', '?populate=*');
  await testFetch('Deep Populate Tiers', '?populate[pricingTiers][populate]=*');
  await testFetch('Mixed Populate', '?populate=*&populate[pricingTiers][populate]=*');
}

run();
