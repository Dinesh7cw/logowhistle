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
        console.log('Top level fields:', Object.keys(json.data));
        if (json.data.heroHeadline) {
           console.log('heroHeadline found:', json.data.heroHeadline);
        } else {
           console.log('heroHeadline MISSING');
        }
    }
  } catch (e) {
    console.error(`FETCH ERROR: ${e.message}`);
  }
}

async function run() {
  await testFetch('Tiers Only Populate', '?populate[pricingTiers][populate]=*');
}

run();
