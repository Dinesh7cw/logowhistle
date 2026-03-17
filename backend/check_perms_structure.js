const axios = require('axios');
const STRAPI_URL = 'http://127.0.0.1:1337';

async function checkPermissions() {
  try {
    const login = await axios.post(`${STRAPI_URL}/admin/login`, {
      email: 'admin@logowhistle.com', 
      password: 'Password123!'
    });
    const token = login.data.data.token;
    
    const rolesRes = await axios.get(`${STRAPI_URL}/admin/users-permissions/roles`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    const publicRole = rolesRes.data.data.find(r => r.name === 'Public');
    const roleRes = await axios.get(`${STRAPI_URL}/admin/users-permissions/roles/${publicRole.id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    console.log(JSON.stringify(roleRes.data.role.permissions, null, 2));
  } catch(e) {
    console.error('Error:', e.message);
  }
}

checkPermissions();
