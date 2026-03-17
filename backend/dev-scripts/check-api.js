
const axios = require('axios');

async function checkData() {
  try {
    const globalRes = await axios.get('http://localhost:1337/api/global?populate=*');
    console.log('Global Data:', JSON.stringify(globalRes.data, null, 2));

    const homepageRes = await axios.get('http://localhost:1337/api/homepage?populate=*');
    console.log('Homepage Data:', JSON.stringify(homepageRes.data, null, 2));
  } catch (error) {
    console.error('Fetch failed:', error.message);
  }
}

checkData();
