const fetch = require('node-fetch');

async function test(query) {
  try {
    const res = await fetch(`http://localhost:1337/api/faq-page?${query}`);
    console.log(`QUERY: ${query.substring(0, 100)}...`);
    console.log(`STATUS: ${res.status}`);
    const data = await res.json();
    if (res.status !== 200) {
      console.log('ERROR DATA:', JSON.stringify(data, null, 2));
    } else {
      console.log('SUCCESS: Data fetched');
    }
  } catch (e) {
    console.error(`ERROR: ${e.message}`);
  }
}

(async () => {
  console.log('--- Testing basic fetch ---');
  await test('');

  console.log('\n--- Testing populate=sections ---');
  await test('populate=sections');

  console.log('\n--- Testing deep FAQ populate ---');
  await test('populate[sections][on][sections.faq][populate][faqs][populate]=*');
})();
