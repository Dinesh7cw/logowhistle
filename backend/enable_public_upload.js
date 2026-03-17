const STRAPI_URL = 'http://127.0.0.1:1337';

async function enablePublicUpload() {
  try {
    // 1. Login to get token
    const loginRes = await fetch(`${STRAPI_URL}/admin/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'admin@logowhistle.com', 
        password: 'Password123!'
      })
    });
    const loginData = await loginRes.json();
    if (!loginRes.ok) throw new Error(`Login failed: ${JSON.stringify(loginData)}`);
    const token = loginData.data.token;
    console.log('✅ Admin login successful');

    // 2. Get Public Role ID
    const rolesRes = await fetch(`${STRAPI_URL}/admin/users-permissions/roles`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const rolesData = await rolesRes.json();
    const publicRole = rolesData.data.find(r => r.name === 'Public');
    if (!publicRole) throw new Error('Public role not found');
    console.log(`✅ Found Public role (ID: ${publicRole.id})`);

    // 3. Get Full Role Details
    const roleRes = await fetch(`${STRAPI_URL}/admin/users-permissions/roles/${publicRole.id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const roleData = await roleRes.json();
    const permissions = roleData.role.permissions;

    // 4. Enable Upload Permissions
    // Strapi 5 Upload Plugin permissions are usually under 'plugin::upload'
    // but sometimes in 'users-permissions' schema they are organized by plugin name
    
    if (!permissions['plugin::upload']) {
       permissions['plugin::upload'] = { controllers: { 'content-api': { upload: { enabled: true }, destroy: { enabled: true } } } };
    } else {
       if (!permissions['plugin::upload'].controllers['content-api']) {
         permissions['plugin::upload'].controllers['content-api'] = { upload: { enabled: true }, destroy: { enabled: true } };
       } else {
         permissions['plugin::upload'].controllers['content-api'].upload = { enabled: true };
         permissions['plugin::upload'].controllers['content-api'].destroy = { enabled: true };
       }
    }
    
    // Also ensure FAQ items etc are enabled if they were missed
    if (permissions['api::faq-item']) {
      permissions['api::faq-item'].controllers['faq-item'].find.enabled = true;
      permissions['api::faq-item'].controllers['faq-item'].findOne.enabled = true;
    }

    // 5. Update Role
    const updateRes = await fetch(`${STRAPI_URL}/admin/users-permissions/roles/${publicRole.id}`, {
      method: 'PUT',
      headers: { 
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ permissions })
    });
    
    if (updateRes.ok) {
      console.log('✅ Public upload permissions enabled successfully!');
    } else {
      const err = await updateRes.json();
      console.error('❌ Failed to update permissions:', JSON.stringify(err, null, 2));
    }
  } catch(e) {
    console.error('❌ Error:', e.message);
  }
}

enablePublicUpload();
