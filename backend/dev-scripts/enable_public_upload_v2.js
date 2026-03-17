const http = require('http');

const STRAPI_HOST = '127.0.0.1';
const STRAPI_PORT = 1337;

function request(options, data = null) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => body += chunk);
      res.on('end', () => {
        try {
          const json = body ? JSON.parse(body) : {};
          if (res.statusCode >= 200 && res.statusCode < 300) resolve(json);
          else reject(new Error(`Status ${res.statusCode}: ${body}`));
        } catch (e) {
          reject(new Error(`Parse error: ${body}`));
        }
      });
    });
    req.on('error', reject);
    if (data) req.write(JSON.stringify(data));
    req.end();
  });
}

async function run() {
  try {
    // 1. Login
    console.log('Logging in...');
    const login = await request({
      hostname: STRAPI_HOST,
      port: STRAPI_PORT,
      path: '/admin/login',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    }, { email: 'admin@logowhistle.com', password: 'Password123!' });
    const token = login.data.token;
    console.log('✅ Logged in');

    // 2. Get Roles
    const roles = await request({
      hostname: STRAPI_HOST,
      port: STRAPI_PORT,
      path: '/admin/users-permissions/roles',
      method: 'GET',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const publicRole = roles.data.find(r => r.name === 'Public');
    console.log(`✅ Public Role ID: ${publicRole.id}`);

    // 3. Get Role Details
    const roleDetails = await request({
      hostname: STRAPI_HOST,
      port: STRAPI_PORT,
      path: `/admin/users-permissions/roles/${publicRole.id}`,
      method: 'GET',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const permissions = roleDetails.role.permissions;

    // 4. Enable Upload
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

    // 5. Update Role
    await request({
      hostname: STRAPI_HOST,
      port: STRAPI_PORT,
      path: `/admin/users-permissions/roles/${publicRole.id}`,
      method: 'PUT',
      headers: { 
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    }, { permissions });
    console.log('✅ Permissions updated!');

  } catch (e) {
    console.error('❌ Error:', e.message);
  }
}

run();
