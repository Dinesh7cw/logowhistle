const BetterSqlite3 = require('better-sqlite3');
const path = require('path');

const dbPath = path.resolve(process.cwd(), '.tmp/data.db');
const db = new BetterSqlite3(dbPath);

const pricingData = {
  hero_headline: "Logo Design Pricing",
  hero_subheadline: "A variety of logo design packages to fit your budget and needs",
  description_left: "LogoWhistle offers budget-friendly logo design solutions starting at just $195. Our versatile team can handle a wide range of design styles & requirements, ensuring we can cater to your specific design needs.",
  description_right: "If you don’t find a suitable match among our standard pricing options, feel free to contact us directly. Get in touch with us today to discuss your unique design requirements.",
  plans: [
    {
      name: "BASIC",
      tagline: "Suitable for customers looking for logo only",
      price: "$195",
      features: "3 Business Days\n3 Round Revisions\nVector File Transfer",
      button_label: "Get Now"
    },
    {
      name: "ECONOMIC",
      tagline: "Suitable for customers looking for logo & basic social media designs",
      price: "$245",
      features: "4 Business Days\nUnlimited Revisions\nVector File Transfer\nSocial Media Logo Tool Kit\nStationary Designs\n( Business Card )",
      button_label: "Get Now"
    },
    {
      name: "BRAND",
      tagline: "Suitable for customers looking for complete logo and Branding package",
      price: "$325",
      features: "6 Business Days\nUnlimited Revisions\nVector File Transfer\nSocial Media Logo Tool Kit\nStationary Designs\n( Business Card Matching Envelope Letter Head )\nTwitter Header Facebook Cover",
      button_label: "Get Now"
    }
  ]
};

try {
  // 1. Update/Insert Pricing Page Hero Data
  const existingPage = db.prepare('SELECT id FROM pricing_pages LIMIT 1').get();
  let pageId;
  
  if (existingPage) {
    pageId = existingPage.id;
    db.prepare("UPDATE pricing_pages SET hero_headline = ?, hero_subheadline = ?, hero_description_left = ?, hero_description_right = ?, updated_at = datetime('now') WHERE id = ?")
      .run(pricingData.hero_headline, pricingData.hero_subheadline, pricingData.description_left, pricingData.description_right, pageId);
    console.log('Updated Pricing Page hero content.');
  } else {
    const documentId = Math.random().toString(36).substring(2, 12);
    const result = db.prepare("INSERT INTO pricing_pages (hero_headline, hero_subheadline, hero_description_left, hero_description_right, document_id, published_at, created_at, updated_at) VALUES (?, ?, ?, ?, ?, datetime('now'), datetime('now'), datetime('now'))")
      .run(pricingData.hero_headline, pricingData.hero_subheadline, pricingData.description_left, pricingData.description_right, documentId);
    pageId = result.lastInsertRowid;
    console.log('Inserted Pricing Page hero content.');
  }

  // 2. Clear existing Pricing Tiers for this page
  const componentLinks = db.prepare("SELECT cmp_id FROM pricing_pages_cmps WHERE entity_id = ? AND component_type = 'pricing.tier'").all(pageId);
  
  for (const link of componentLinks) {
    db.prepare('DELETE FROM components_pricing_tiers WHERE id = ?').run(link.cmp_id);
  }
  db.prepare("DELETE FROM pricing_pages_cmps WHERE entity_id = ? AND component_type = 'pricing.tier'").run(pageId);
  console.log('Cleared existing pricing tiers.');

  // 3. Insert fresh Pricing Tiers
  for (let i = 0; i < pricingData.plans.length; i++) {
    const plan = pricingData.plans[i];
    const compResult = db.prepare("INSERT INTO components_pricing_tiers (package_name, package_tagline, package_price, package_features, button_label, button_url) VALUES (?, ?, ?, ?, ?, ?)")
      .run(plan.name, plan.tagline, plan.price, plan.features, plan.button_label, '/contact');
    
    const cmpId = compResult.lastInsertRowid;
    
    // Link component to page
    db.prepare("INSERT INTO pricing_pages_cmps (entity_id, cmp_id, component_type, field, [order]) VALUES (?, ?, 'pricing.tier', 'pricingTiers', ?)")
      .run(pageId, cmpId, i + 1);
  }
  console.log('Successfully populated all pricing tiers.');

} catch (err) {
  console.error('Error populating pricing data:', err);
} finally {
  db.close();
}
