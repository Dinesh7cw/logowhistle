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
        console.log(`SUCCESS: (data received)`);
        // Check if icons are present
        if (json.data && json.data.pricingTiers) {
           console.log('Tiers Count:', json.data.pricingTiers.length);
           console.log('First Tier Keys:', Object.keys(json.data.pricingTiers[0]));
           if (json.data.pricingTiers[0].packageIcon) {
              console.log('Icon present!');
           } else {
              console.log('Icon MISSING');
           }
        }
    }
  } catch (e) {
    console.error(`FETCH ERROR: ${e.message}`);
  }
}

async function run() {
  console.log('\n--- Test 5: Dot notation populate ---');
  await testFetch('Dot Notation', '?populate[0]=heroDividerImage&populate[1]=pricingTiers.packageIcon');
}

run();
