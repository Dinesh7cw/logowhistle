const fetch = require('node-fetch');

(async () => {
  try {
    const res = await fetch('http://127.0.0.1:1337/api/upload');
    console.log(`STATUS: ${res.status}`);
    const data = await res.text();
    console.log(data);
  } catch (e) {
    console.error(`ERROR: ${e.message}`);
  }
})();
