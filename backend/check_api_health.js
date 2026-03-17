const fetch = require('node-fetch');

async function checkApi() {
  try {
    const res = await fetch('http://localhost:1337/api/contact-page');
    console.log('Contact Page Status:', res.status);
    const data = await res.json();
    console.log('Contact Page Data:', JSON.stringify(data, null, 2).substring(0, 500));

    const res2 = await fetch('http://localhost:1337/api/contact-inquiries');
    console.log('Inquiries Status:', res2.status);
    const data2 = await res2.json();
    console.log('Inquiries Data:', JSON.stringify(data2, null, 2).substring(0, 500));
  } catch (err) {
    console.error('Error:', err);
  }
}

checkApi();
