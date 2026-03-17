const fetch = require('node-fetch');

async function testFetch(endpoint) {
  const url = `http://localhost:1337/api/${endpoint}`;
  console.log(`Fetching: ${url}`);
  const res = await fetch(url);
  const json = await res.json();
  if (!res.ok) {
    console.error('Error:', JSON.stringify(json, null, 2));
  } else {
    // console.log('Success:', JSON.stringify(json, null, 2));
    console.log('Success: (data received)');
  }
}

async function run() {
  console.log('--- Test 1: No populate ---');
  await testFetch('pricing-page');
  
  console.log('\n--- Test 2: Simple populate ---');
  await testFetch('pricing-page?populate=*');

  console.log('\n--- Test 3: Complex populate ---');
  await testFetch('pricing-page?populate[heroDividerImage]=*&populate[pricingTiers][populate]=*');
}

run();
