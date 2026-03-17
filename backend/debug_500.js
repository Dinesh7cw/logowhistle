const fetch = require('node-fetch');

async function test(query) {
  try {
    const res = await fetch(`http://127.0.0.1:1337/api/faq-page?${query}`);
    console.log(`QUERY: ${query.substring(0, 50)}...`);
    console.log(`STATUS: ${res.status}`);
    if (res.status === 500) {
      const text = await res.text();
      console.log('ERROR TEXT:', text.substring(0, 200));
    }
  } catch (e) {
    console.error(`ERROR: ${e.message}`);
  }
}

(async () => {
  console.log('--- Testing basic fetch ---');
  await test('');

  console.log('\n--- Testing populate=* ---');
  await test('populate=*');

  console.log('\n--- Testing dynamic zone populate basics ---');
  await test('populate[sections][populate]=*');

  console.log('\n--- Testing specific component on syntax ---');
  await test('populate[sections][on][sections.hero][populate]=*');

  console.log('\n--- Testing FAQ component relation populate ---');
  await test('populate[sections][on][sections.faq][populate][faqs][populate]=*');
})();
