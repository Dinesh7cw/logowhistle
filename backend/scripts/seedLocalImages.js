const fs = require('fs');
const path = require('path');
const fetch = require('node-fetch');
const FormData = require('form-data');

const STRAPI = 'http://localhost:1337';
const IMAGE_DIR = 'D:\\logowhistle\\logowhistle-clone\\images';

async function uploadImage(filePath) {
  try {
    const filename = path.basename(filePath);
    const buffer = fs.readFileSync(filePath);
    const ext = filename.split('.').pop().toLowerCase();
    const mime = ext === 'png' ? 'image/png' : 'image/jpeg';
    
    const form = new FormData();
    form.append('files', buffer, { filename, contentType: mime });
    
    const res = await fetch(`${STRAPI}/api/upload`, { 
      method: 'POST', 
      body: form, 
      headers: form.getHeaders() 
    });
    
    const data = await res.json();
    if (data && data[0] && data[0].id) {
      console.log(`✅ Uploaded ${filename} -> ID: ${data[0].id}`);
      return data[0].id;
    } else {
      console.error(`❌ Failed to upload ${filename}`, data);
      return null;
    }
  } catch (e) {
    console.error(`❌ Error uploading ${filePath}:`, e.message);
    return null;
  }
}

async function run() {
  console.log('--- Starting Local Images Seeding ---');
  
  // 1. Upload Global Images
  console.log('\n--- Global Images ---');
  const globalImages = {
    facebookIcon: await uploadImage(path.join(IMAGE_DIR, 'facebook.png')),
    linkedinIcon: await uploadImage(path.join(IMAGE_DIR, 'linkedin.png')),
    skypeIcon: await uploadImage(path.join(IMAGE_DIR, 'skype.png')),
    twitterIcon: await uploadImage(path.join(IMAGE_DIR, 'twitter.png')),
    logo: await uploadImage(path.join(IMAGE_DIR, 'logo-whistle.png'))
  };
  
  await fetch(`${STRAPI}/api/global`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ data: globalImages })
  });
  console.log('✅ Global updated.');
  
  // 2. Upload Homepage Images
  console.log('\n--- Homepage Images ---');
  const dividerId = await uploadImage(path.join(IMAGE_DIR, 'LogoWhistle-divider.png'));
  await fetch(`${STRAPI}/api/homepage`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ data: { dividerImage: dividerId } })
  });
  console.log('✅ Homepage updated.');
  
  // 3. Upload Portfolio Images
  console.log('\n--- Portfolio Images ---');
  const portfolioMap = {
    'on-a-healthy-note': 'Logo-Design-On-a-healthy-note-featured_image.jpg',
    'skillcubator': 'Logo-Design-Elearning-Skillcubator-featured_image.jpg',
    'power-benchmarking': 'Logo-Design-Power-Benchmarking-featured_image.jpg',
    'opus-sustainability-ventures-inc': 'Logo-Design-Opus-Sustainability-Ventures-Inc-featured_image.jpg',
    'edge-entity': 'Logo-Edge-Entity-featured_image.jpg',
    'organic-blends': 'Logo-Design-Organic-Blends-featured_image.jpg',
    'aspirity': 'Logo-Design-AspirityTech-featured_image.jpg',
    'elite-cardiovascular-group': 'Logo_Elite-Cardiovascular-Group-featured-image.jpg',
    'small-town-girl': 'Logo-small-town-girl-featured-image.jpg',
    'minas-timber': 'Logo-Minas-Timber-featured-image.jpg',
    'esg-validation': 'Logo-ESG-Validation-featured-image.jpg',
    'jc-barnett-school-of-jump-shooting': 'Logo-Design-JC-Barnett-featured-image.jpg',
    'aj-agro': 'Logo-Aj-Agro-featured-image.jpg'
  };
  
  const resp = await fetch(`${STRAPI}/api/portfolio-items?pagination[pageSize]=100`);
  const json = await resp.json();
  const items = json.data || [];
  
  for (const item of items) {
    const slug = item.slug;
    const docId = item.documentId;
    const filename = portfolioMap[slug];
    
    if (filename) {
      const imgId = await uploadImage(path.join(IMAGE_DIR, filename));
      if (imgId) {
        await fetch(`${STRAPI}/api/portfolio-items/${docId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ data: { featuredImage: imgId } })
        });
        console.log(`✅ Linked portfolio: ${slug}`);
      }
    }
  }

  console.log('\n--- Seeding Complete ---');
}

run().catch(console.error);
