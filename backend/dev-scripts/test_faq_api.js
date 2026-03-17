const fetch = require('node-fetch');

(async () => {
  try {
    const pageRes = await fetch('http://127.0.0.1:1337/api/faq-page');
    console.log(`FAQ PAGE STATUS: ${pageRes.status}`);
    const pageData = await pageRes.json();
    console.log('FAQ PAGE DATA:', JSON.stringify(pageData, null, 2));

    const itemRes = await fetch('http://127.0.0.1:1337/api/faq-items?pagination[pageSize]=1');
    console.log(`FAQ ITEMS STATUS: ${itemRes.status}`);
    const itemData = await itemRes.json();
    console.log('FAQ ITEMS DATA:', JSON.stringify(itemData, null, 2));
  } catch (e) {
    console.error(`ERROR: ${e.message}`);
  }
})();
