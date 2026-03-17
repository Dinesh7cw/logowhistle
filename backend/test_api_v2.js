const fetch = require('node-fetch');

async function testApi() {
  const endpoints = [
    'pricing-page?populate=*',
    'process-page?populate=*',
    'faq-items',
    'blog-posts?pagination[limit]=1'
  ];

  for (const endpoint of endpoints) {
    try {
      const url = `http://localhost:1337/api/${endpoint}`;
      console.log(`Testing ${url}...`);
      const res = await fetch(url);
      console.log(`Status: ${res.status}`);
      const json = await res.json();
      if (res.ok) {
        console.log(`Data found: ${!!json.data}`);
      } else {
        console.log(`Error: ${JSON.stringify(json.error)}`);
      }
    } catch (err) {
      console.log(`Fetch failed: ${err.message}`);
    }
    console.log('---');
  }
}

testApi();
