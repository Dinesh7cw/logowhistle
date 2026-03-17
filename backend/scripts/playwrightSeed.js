const { chromium } = require('playwright');
const fs = require('fs');
const FormData = require('form-data');
const fetch = require('node-fetch'); // ensuring we use the installed node-fetch

const STRAPI = 'http://localhost:1337';

const portfolioItemsMap = {
  'on-a-healthy-note': 'https://logowhistle.com/wp-content/uploads/2023/09/Logo-Design-On-a-healthy-note-featured_image.jpg',
  'skillcubator': 'https://logowhistle.com/wp-content/uploads/2023/09/Logo-Design-Elearning-Skillcubator-featured-image.jpg',
  'power-benchmarking': 'https://logowhistle.com/wp-content/uploads/2023/09/Logo-Design-Power-Benchmarking-featured-image.jpg',
  'opus-sustainability-ventures-inc': 'https://logowhistle.com/wp-content/uploads/2023/09/Logo-Design--Opus-Sustainability-Ventures-Inc-featured-image.jpg',
  'edge-entity': 'https://logowhistle.com/wp-content/uploads/2023/09/Logo-Edge-Entity-featured_image.jpg',
  'organic-blends': 'https://logowhistle.com/wp-content/uploads/2023/09/Logo-Design--Organic-Blends-featured-image.jpg',
  'aspirity': 'https://logowhistle.com/wp-content/uploads/2023/09/Logo-Design-AspirityTech-featured_image.jpg',
  'elite-cardiovascular-group': 'https://logowhistle.com/wp-content/uploads/2023/09/Logo_Elite-Cardiovascular-Group-featured-image.jpg',
  'small-town-girl': 'https://logowhistle.com/wp-content/uploads/2023/09/Logo-small-town-girl-featured-image.jpg',
  'minas-timber': 'https://logowhistle.com/wp-content/uploads/2023/09/Logo-Minas-Timber-featured-image.jpg',
  'esg-validation': 'https://logowhistle.com/wp-content/uploads/2023/09/Logo-ESG-Validation-featured-image.jpg',
  'jc-barnett-school-of-jump-shooting': 'https://logowhistle.com/wp-content/uploads/2023/09/Logo-Design-JC-Barnett-featured-image.jpg',
  'aj-agro': 'https://logowhistle.com/wp-content/uploads/2023/09/Logo-Aj-Agro-featured-image.jpg'
};

const blogPostsMap = {
  'non-profit-organizations-logo-design': 'https://logowhistle.com/wp-content/uploads/2024/06/30-Inspiring-Logo-Designs-for-Non-Profit-Organizations-Featured-Image-LogoWhistle.jpg',
  'logo-design-tips-for-beginners': 'https://logowhistle.com/wp-content/uploads/2024/06/15-Essential-Logo-Design-Tips-For-Beginners-Featured-Image-LogoWhistle.jpg',
  'e-commerce-logo-design': 'https://logowhistle.com/wp-content/uploads/2024/05/Logo-Design-in-E-commerce-Featured-Image-LogoWhistle.jpg',
  'healthcare-logo-design-ideas': 'https://logowhistle.com/wp-content/uploads/2024/04/Healthcare-Branding-and-Creating-Trust-through-Logo-Design-Featured-Image-LogoWhistle.jpg',
  'evolution-of-logos': 'https://logowhistle.com/wp-content/uploads/2024/04/Evolution-of-Logos-Featured-Image-LogoWhistle.png',
  'nature-inspired-logo-design-ideas': 'https://logowhistle.com/wp-content/uploads/2024/03/Nature-Inspired-Logo-Designs-Featured-Image-LogoWhistle.jpg',
  'logo-design-role-in-ux-ui': 'https://logowhistle.com/wp-content/uploads/2024/02/The-Role-of-Logo-Design-in-UXUI-Featured-Image-LogoWhistle.jpg',
  'logo-design-approaches-across-industries': 'https://logowhistle.com/wp-content/uploads/2024/02/Logo-Design-Approaches-Across-Industries-Featured-Image-LogoWhistle.jpg',
  'luxury-logo-design-essentials': 'https://logowhistle.com/wp-content/uploads/2024/01/Logo-Design-Essentials-for-Luxury-Brand-Logos-Featured-Image-LogoWhistle.jpg',
  'hidden-meanings-behind-famous-logos': 'https://logowhistle.com/wp-content/uploads/2024/01/Hidden-Meanings-Behind-Famous-Logos-Featured-Image-LogoWhistle.jpg',
  'logo-design-case-studies': 'https://logowhistle.com/wp-content/uploads/2024/01/Logo-Design-Case-Studies-Featured-Image-LogoWhistle.jpg',
  'logo-design-trends': 'https://logowhistle.com/wp-content/uploads/2024/01/Logo-Design-Trends-in-2024-Whats-in-and-out-Featured-Image-LogoWhistle-1.jpg',
  'startup-logo-design-tips': 'https://logowhistle.com/wp-content/uploads/2024/01/Logo-Design-Tips-for-Startups-Creating-A-Lasting-First-Impression-Featured-Image-LogoWhistle.png',
  'logo-design-mistakes-to-avoid': 'https://logowhistle.com/wp-content/uploads/2023/12/Dos-and-Donts-of-Logo-Design-Featured-Image-LogoWhistle.jpg',
  'creating-timeless-logo': 'https://logowhistle.com/wp-content/uploads/2023/12/Creating-a-Timeless-Logo-Featured-Image-LogoWhistle.jpg',
  'best-fonts-for-logos': 'https://logowhistle.com/wp-content/uploads/2023/12/Best-Fonts-for-Logos-Featured-Image-LogoWhistle.jpg',
  'logo-rebranding-tips': 'https://logowhistle.com/wp-content/uploads/2023/11/Logo-Rebranding-Tips-Featured-Image-LogoWhistle.jpg',
  'restaurant-logo-design': 'https://logowhistle.com/wp-content/uploads/2023/11/Restaurant-Logo-Design-Featured-Image-LogoWhistle.jpg',
  'logo-psychology': 'https://logowhistle.com/wp-content/uploads/2023/11/Logo-Psychology-Featured-Image-LogoWhistle.jpg',
  'real-estate-logo-design': 'https://logowhistle.com/wp-content/uploads/2023/10/Real-Estate-Logo-Design-Featured-Image-LogoWhistle.jpg',
  'sports-logo-design': 'https://logowhistle.com/wp-content/uploads/2023/10/Sports-Logo-Design-Featured-Image-LogoWhistle.jpg',
  'law-firm-logo-design': 'https://logowhistle.com/wp-content/uploads/2023/10/Law-Firm-Logo-Design-Featured-Image-LogoWhistle.jpg',
  'technology-logo-design': 'https://logowhistle.com/wp-content/uploads/2023/10/Technology-Logo-Design-Featured-Image-LogoWhistle.jpg',
  'fashion-logo-design': 'https://logowhistle.com/wp-content/uploads/2023/09/Fashion-Logo-Design-Featured-Image-LogoWhistle.jpg',
  'text-logo-designs': 'https://logowhistle.com/wp-content/uploads/2023/05/Text-Logo-Designs-That-Will-Win-You-Customers-LogoWhistle-1.jpg',
  'music-band-logo-design': 'https://logowhistle.com/wp-content/uploads/2023/05/Most-Iconic-Band-And-Music-Logo-Designs-LogoWhistle.jpg',
  'church-logo-design': 'https://logowhistle.com/wp-content/uploads/2023/05/Church-Logo-Design-Ideas-And-Inspirations-LogoWhistle.jpg',
  'photography-logo-design-ideas': 'https://logowhistle.com/wp-content/uploads/2023/05/80-Best-Photography-Logo-Designs-Ideas-LogoWhistle.jpg',
  'fitness-logo-design': 'https://logowhistle.com/wp-content/uploads/2023/05/Fitness-Logo-Design-Ideas-and-Inspirations-LogoWhistle.jpg',
  'illustrator-for-beginners': 'https://logowhistle.com/wp-content/uploads/2023/05/Illustrator-for-Beginners-A-Complete-Guide-To-Create-Highly-Professional-Designs-LogoWhistle.jpg',
  'white-label-graphic-design-services': 'https://logowhistle.com/wp-content/uploads/2023/05/White-Label-Graphic-Design-Services-LogoWhistle.jpg',
  'color-psychology-in-logo-design': 'https://logowhistle.com/wp-content/uploads/2023/05/The-Psychology-Of-Colors-In-Logo-Design-LogoWhistle.jpg',
  'branding-vs-logo-design': 'https://logowhistle.com/wp-content/uploads/2023/05/Branding-vs-Logo-Design-Understanding-the-Crucial-Differences-LogoWhistle.jpg',
  'indian-logo-designs': 'https://logowhistle.com/wp-content/uploads/2023/05/10-Iconic-Indian-Logo-Designs-LogoWhistle.jpg'
};

async function uploadImage(buffer, name) {
  try {
    const ext = name.split('.').pop().toLowerCase();
    const mime = ext === 'png' ? 'image/png' : 'image/jpeg';
    const form = new FormData();
    form.append('files', buffer, { filename: name, contentType: mime });
    const res = await fetch(`${STRAPI}/api/upload`, { method: 'POST', body: form, headers: form.getHeaders() });
    const data = await res.json();
    if (data[0]?.id) return data[0].id;
  } catch (e) {
    console.log('Upload error', e.message);
  }
  return null;
}

async function run() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  });
  const page = await context.newPage();

  async function processCollection(apiPath, urlMap, prefix) {
    console.log(`\nFetching ${apiPath}...`);
    const resp = await fetch(`${STRAPI}/api/${apiPath}?populate=featuredImage&pagination[pageSize]=100`);
    const json = await resp.json();
    const items = json.data || [];

    let count = 0;
    for (const item of items) {
      const slug = item.slug;
      const docId = item.documentId;
      const imageUrl = urlMap[slug];
      
      if (!imageUrl) continue;
      if (item.featuredImage) {
        console.log(`[ ] ${slug} already has image.`);
        continue;
      }
      
      console.log(`[!] ${slug} missing image. Fetching...`);
      try {
        const imgRes = await page.goto(imageUrl, { waitUntil: 'load' });
        const buffer = await imgRes.body();
        
        const ext = imageUrl.endsWith('.png') ? 'png' : 'jpg';
        const filename = `${prefix}-${slug}.${ext}`;
        
        const uploadedId = await uploadImage(buffer, filename);
        if (uploadedId) {
          // Update item in Strapi
          await fetch(`${STRAPI}/api/${apiPath}/${docId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ data: { featuredImage: uploadedId } })
          });
          console.log(`  ✅ Uploaded and linked ID: ${uploadedId}`);
          count++;
        } else {
          console.log(`  ❌ Failed to upload ${slug}`);
        }
      } catch (err) {
        console.log(`  ❌ Error fetching ${imageUrl}: ${err.message}`);
      }
      // Small pause to avoid ban
      await new Promise(r => setTimeout(r, 1000));
    }
    console.log(`Completed ${apiPath}, updated ${count} items.`);
  }

  await processCollection('portfolio-items', portfolioItemsMap, 'portfolio');
  await processCollection('blog-posts', blogPostsMap, 'blog');

  await browser.close();
  console.log('DONE!');
}

run().catch(console.error);
