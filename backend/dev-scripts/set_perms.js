const axios = require('axios');
const STRAPI_URL = 'http://127.0.0.1:1337';

async function setPermissions() {
  try {
    const login = await axios.post(`${STRAPI_URL}/admin/login`, {
      email: 'admin@logowhistle.com', 
      password: 'Password123!'
    });
    const token = login.data.data.token;
    
    // Get roles
    const rolesRes = await axios.get(`${STRAPI_URL}/admin/users-permissions/roles`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    const publicRole = rolesRes.data.data.find(r => r.name === 'Public');
    if (!publicRole) {
      console.log('Public role not found');
      return;
    }

    const roleUrl = `${STRAPI_URL}/admin/users-permissions/roles/${publicRole.id}`;
    const roleRes = await axios.get(roleUrl, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    const permissions = roleRes.data.role.permissions;
    if (permissions['api::faq-item']) {
      permissions['api::faq-item'].controllers['faq-item'].find.enabled = true;
      permissions['api::faq-item'].controllers['faq-item'].findOne.enabled = true;
    }
    if (permissions['api::faq-page']) {
      permissions['api::faq-page'].controllers['faq-page'].find.enabled = true;
    }

    await axios.put(roleUrl, { permissions }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('Permissions updated successfully!');
  } catch(e) {
    console.error('Error:', e.message);
    if (e.response) {
      console.error(e.response.data);
    }
  }
}

setPermissions();
