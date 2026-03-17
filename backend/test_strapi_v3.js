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
        console.log(`SUCCESS:`, JSON.stringify(json, null, 2).substring(0, 500) + '...');
    }
  } catch (e) {
    console.error(`FETCH ERROR: ${e.message}`);
  }
}

async function run() {
  console.log('\n--- Test 4: Explicit Hero Media + Tiers ---');
  await testFetch('Explicit', '?populate[heroDividerImage]=*&populate[pricingTiers][populate]=*');
}

run();
