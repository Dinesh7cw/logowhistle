const Database = require('better-sqlite3');
const path = require('path');
const dbPath = path.join(__dirname, '.tmp', 'data.db');
const db = new Database(dbPath);

const genId = () => Math.random().toString(36).substring(2, 12);

try {
  // 1. PRICING PAGE
  console.log('--- Restoring Pricing Page ---');
  const pricingData = {
    hero_headline: "Logo Design Pricing",
    hero_subheadline: "A variety of logo design packages to fit your budget and needs",
    hero_description_left: "LogoWhistle offers budget-friendly logo design solutions starting at just $195. Our versatile team can handle a wide range of design styles & requirements, ensuring we can cater to your specific design needs.",
    hero_description_right: "If you don’t find a suitable match among our standard pricing options, feel free to contact us directly. Get in touch with us today to discuss your unique design requirements.",
    plans: [
      { name: "BASIC", tagline: "Suitable for customers looking for logo only", price: "$195", features: "3 Business Days\n3 Round Revisions\nVector File Transfer" },
      { name: "ECONOMIC", tagline: "Suitable for customers looking for logo & basic social media designs", price: "$245", features: "4 Business Days\nUnlimited Revisions\nVector File Transfer\nSocial Media Logo Tool Kit\nStationary Designs\n( Business Card )" },
      { name: "BRAND", tagline: "Suitable for customers looking for complete logo and Branding package", price: "$325", features: "6 Business Days\nUnlimited Revisions\nVector File Transfer\nSocial Media Logo Tool Kit\nStationary Designs\n( Business Card Matching Envelope Letter Head )\nTwitter Header Facebook Cover" }
    ]
  };
  
  let pricingPage = db.prepare('SELECT id FROM pricing_pages LIMIT 1').get();
  let pricingId;
  if (!pricingPage) {
    const res = db.prepare("INSERT INTO pricing_pages (hero_headline, hero_subheadline, hero_description_left, hero_description_right, document_id, created_at, updated_at, published_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)")
      .run(pricingData.hero_headline, pricingData.hero_subheadline, pricingData.hero_description_left, pricingData.hero_description_right, genId(), Date.now(), Date.now(), Date.now());
    pricingId = res.lastInsertRowid;
  } else {
    pricingId = pricingPage.id;
    db.prepare("UPDATE pricing_pages SET hero_headline = ?, hero_subheadline = ?, hero_description_left = ?, hero_description_right = ? WHERE id = ?")
      .run(pricingData.hero_headline, pricingData.hero_subheadline, pricingData.hero_description_left, pricingData.hero_description_right, pricingId);
  }

  // Clear existing pricing ties
  db.prepare("DELETE FROM pricing_pages_cmps WHERE entity_id = ? AND component_type = 'pricing.tier'").run(pricingId);
  
  for (let i = 0; i < pricingData.plans.length; i++) {
    const plan = pricingData.plans[i];
    const comp = db.prepare("INSERT INTO components_pricing_tiers (package_name, package_tagline, package_price, package_features, button_label, button_url) VALUES (?, ?, ?, ?, ?, ?)")
      .run(plan.name, plan.tagline, plan.price, plan.features, 'Get Now', '/contact-us');
    db.prepare("INSERT INTO pricing_pages_cmps (entity_id, cmp_id, component_type, field, [order]) VALUES (?, ?, 'pricing.tier', 'pricingTiers', ?)")
      .run(pricingId, comp.lastInsertRowid, i + 1);
  }
  console.log('✅ Pricing Page restored.');

  // 2. PROCESS PAGE
  console.log('--- Restoring Process Page ---');
  const processData = {
    hero_headline: 'The Logo Design Process',
    hero_subheadline: 'How we create logos that are both timeless and trendsetting',
    description_column_1: "At LogoWhistle, our logo design process begins with a thorough exploration of your business, including its values, target audience, and unique attributes. This initial research provides the foundation for our creative journey.",
    description_column_2: "Moving forward, our talented designers brainstorm and sketch ideas until we discover the perfect concept that aligns with your brand's essence. With the concept refined, we transition to digital design.",
    help_row_1_text: "If you have a preliminary idea for your logo, whether it's described in words or sketched out, rest assured that our custom logo design company will bring it to life.",
    help_row_2_text: "Logos are almost always the first aspect of your business to grab customers' attention. Getting a logo-design job well done is all about effective communication.",
    help_row_3_text: "Help us understand your preferences in colors and patterns to get the output you desire. And get best logo design services from us."
  };

  let processPage = db.prepare('SELECT id FROM process_pages LIMIT 1').get();
  if (!processPage) {
    db.prepare("INSERT INTO process_pages (hero_headline, hero_subheadline, description_column_1, description_column_2, help_row_1_text, help_row_2_text, help_row_3_text, document_id, created_at, updated_at, published_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)")
      .run(processData.hero_headline, processData.hero_subheadline, processData.description_column_1, processData.description_column_2, processData.help_row_1_text, processData.help_row_2_text, processData.help_row_3_text, genId(), Date.now(), Date.now(), Date.now());
  } else {
    db.prepare("UPDATE process_pages SET hero_headline = ?, hero_subheadline = ?, description_column_1 = ?, description_column_2 = ?, help_row_1_text = ?, help_row_2_text = ?, help_row_3_text = ? WHERE id = ?")
      .run(processData.hero_headline, processData.hero_subheadline, processData.description_column_1, processData.description_column_2, processData.help_row_1_text, processData.help_row_2_text, processData.help_row_3_text, processPage.id);
  }
  console.log('✅ Process Page restored.');

  // 3. BLOG PAGE
  console.log('--- Restoring Blog Page ---');
  let blogPage = db.prepare('SELECT id FROM blog_pages LIMIT 1').get();
  if (!blogPage) {
    db.prepare("INSERT INTO blog_pages (page_title, page_subtitle, left_description, right_description, document_id, created_at, updated_at, published_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)")
      .run('Logo Design Blog', 'Inspiring Ideas and Tips and Everything Around Logo Design', 'Our blog is a curated space where we share insights, trends, and tutorials...', 'Whether you are a budding designer or a business owner looking to understand branding better...', genId(), Date.now(), Date.now(), Date.now());
  }
  console.log('✅ Blog Page restored.');

  // 4. FAQ ITEMS
  console.log('--- Restoring FAQ Items ---');
  const count = db.prepare("SELECT COUNT(*) as total FROM faq_items").get().total;
  if (count < 5) {
      const faqs = [
          { q: 'In general, what are the various phases in the whole custom logo designing process?', a: 'The custom logo design process usually starts with the communication phase...', o: 1 },
          { q: 'What is the average turnaround time to get the custom logo design job done?', a: 'Ideally, when the client has the clear picture of what they want, the entire process takes around 3-4 Days...', o: 2 },
          { q: 'Is it really true that you offer unlimited revisions for the logo design?', a: 'Except for the basic package, we offer unlimited revisions until the final delivery...', o: 3 }
      ];
      for (const faq of faqs) {
          db.prepare("INSERT INTO faq_items (question, answer, display_order, document_id, created_at, updated_at, published_at) VALUES (?, ?, ?, ?, ?, ?, ?)")
              .run(faq.q, faq.a, faq.o, genId(), Date.now(), Date.now(), Date.now());
      }
  }
  console.log('✅ FAQ Items restored.');

} catch (e) {
  console.error('Restoration failed:', e.message);
} finally {
  db.close();
}
