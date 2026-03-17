const fs = require('fs')
const path = require('path')

const STRAPI = 'http://127.0.0.1:1337'
const UPLOADS_DIR = path.join(__dirname, '..', 'public', 'uploads')
const HEADERS = { 'Content-Type': 'application/json' }

// ─────────────────────────────────────────────
// HELPER: Download image buffer from URL
// ─────────────────────────────────────────────
async function downloadImage(url) {
  try {
    const res = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' } })
    if (!res.ok) { console.warn(`  ⚠ Download failed: ${url}`); return null }
    return await res.arrayBuffer()
  } catch (e) { console.warn(`  ⚠ Download error: ${e.message}`); return null }
}

// ─────────────────────────────────────────────
// HELPER: Upload image to Strapi → return ID
// ─────────────────────────────────────────────
async function uploadImage(url, name) {
  let buf = await downloadImage(url)
  let uploadName = name

  // If download fails, try to find it locally in public/uploads
  if (!buf) {
    console.log(`  🔍 Searching locally for: ${name}`)
    try {
      const files = fs.readdirSync(UPLOADS_DIR)
      const baseName = name.split('.')[0].replace(/-/g, '_')
      const match = files.find(f => f.toLowerCase().startsWith(baseName.toLowerCase()))
      
      if (match) {
        console.log(`  ✅ Found local match: ${match}`)
        buf = fs.readFileSync(path.join(UPLOADS_DIR, match))
        uploadName = match
      }
    } catch (e) {
      console.warn(`  ⚠ Local search failed: ${e.message}`)
    }
  }

  if (!buf) return null
  const ext = uploadName.split('.').pop().toLowerCase()
  const mime = ext === 'png' ? 'image/png' : 'image/jpeg'
  const form = new FormData()
  
  // Convert Buffer or ArrayBuffer to Blob if needed
  const blob = new Blob([buf], { type: mime })
  form.append('files', blob, uploadName)

  const res = await fetch(`${STRAPI}/api/upload`, { method: 'POST', body: form })
  const data = await res.json()
  if (data[0]?.id) { console.log(`  ✅ Uploaded: ${uploadName} → ID ${data[0].id}`); return data[0].id }
  console.warn(`  ⚠ Upload failed: ${data.error?.message || uploadName}`)
  return null
}

// ─────────────────────────────────────────────
// HELPER: PUT single type
// ─────────────────────────────────────────────
async function putSingle(type, data) {
  const res = await fetch(`${STRAPI}/api/${type}`, {
    method: 'PUT', headers: HEADERS, body: JSON.stringify({ data })
  })
  const json = await res.json()
  if (res.ok) console.log(`  ✅ Updated: ${type}`)
  else console.warn(`  ⚠ Failed ${type}:`, JSON.stringify(json).slice(0, 200))
}

// ─────────────────────────────────────────────
// HELPER: POST collection item (check duplicate first)
// ─────────────────────────────────────────────
async function postItem(type, slugField, slug, data) {
  const check = await fetch(`${STRAPI}/api/${type}?filters[${slugField}][$eq]=${encodeURIComponent(slug)}`)
  const existing = await check.json()
  if (existing.data?.length > 0) { console.log(`  ⏭ Already exists: ${slug}`); return existing.data[0].id }
  const res = await fetch(`${STRAPI}/api/${type}`, {
    method: 'POST', headers: HEADERS, body: JSON.stringify({ data })
  })
  const json = await res.json()
  if (res.ok) { console.log(`  ✅ Created: ${slug}`); return json.data?.id }
  console.warn(`  ⚠ Failed ${type}/${slug}:`, JSON.stringify(json).slice(0, 200))
}

// ─────────────────────────────────────────────
// MAIN SEED
// ─────────────────────────────────────────────
async function seed() {
  console.log('\n🚀 MASTER SEED STARTING...\n')

  // ══════════════════════════════════════════
  // 1. GLOBAL SETTINGS
  // ══════════════════════════════════════════
  console.log('\n[1/9] Global Settings')
  const logoId = await uploadImage(
    'https://logowhistle.com/wp-content/uploads/2023/10/logo-whistle.png',
    'logo-whistle.png'
  )
  await putSingle('global', {
    siteName: 'LogoWhistle',
    logo: logoId,
    copyrightText: 'Copyright 2026 © logoWhistle. A unit of ColorWhistle. All rights reserved.',
    facebookUrl: 'https://www.facebook.com/colorwhistleCW',
    linkedinUrl: 'https://www.linkedin.com/company/colorwhistle/',
    twitterUrl: 'https://twitter.com/colorwhistle',
    skypeUrl: 'skype:sankardesigns?chat'
  })

  // ══════════════════════════════════════════
  // 2. HOMEPAGE
  // ══════════════════════════════════════════
  console.log('\n[2/9] Homepage')
  await putSingle('homepage', {
    heroHeadline: 'From Ideas to Identity',
    heroHeadlineBold: 'Identity',
    heroSubheadline: 'Tailored Logo Design Services that Listen and Build',
    heroDescription: "Say hello to LogoWhistle, your go-to logo design hotspot in India! We're not just about logos; we're here to jazz up your brand with logo design services and tailored branding magic. Our secret sauce? Pouring heart and soul into every logo, making sure it's not just a symbol but a story that speaks for your business. And hey, we don't stop at logos – we've got a whole menu of design delights to make your brand pop.\n\nLogoWhistle is more than your average logo design company – we're your branding buddies. Yep, you guessed it – we're all about that tailored branding goodness too. We're like matchmakers, connecting your business vibe with designs that scream 'you'. So, if you're ready to dive into a sea of colors, creativity, and brand excitement, give LogoWhistle a shout. Let's whip up some branding magic together!",
    ctaSectionTitle: 'From Brainstorms To Brand Brilliance',
    ctaSectionDescription: "Excited to see your brand shine? Give us a shout by clicking the contact button below and let's make some branding magic together!",
    ctaButtonLabel: 'Contact Us',
    ctaButtonUrl: '/contact-us'
  })

  // ══════════════════════════════════════════
  // 3. PORTFOLIO ITEMS
  // ══════════════════════════════════════════
  console.log('\n[3/9] Portfolio Items')
  const portfolioItems = [
    { title: 'On a Healthy Note',                slug: 'on-a-healthy-note',                    order: 1,  img: 'https://logowhistle.com/wp-content/uploads/2023/09/Logo-Design-On-a-healthy-note-featured_image.jpg' },
    { title: 'Skillcubator',                     slug: 'skillcubator',                         order: 2,  img: 'https://logowhistle.com/wp-content/uploads/2023/09/Logo-Design-Elearning-Skillcubator-featured-image.jpg' },
    { title: 'Power Benchmarking',               slug: 'power-benchmarking',                   order: 3,  img: 'https://logowhistle.com/wp-content/uploads/2023/09/Logo-Design-Power-Benchmarking-featured-image.jpg' },
    { title: 'Opus Sustainability Ventures Inc.',slug: 'opus-sustainability-ventures-inc',      order: 4,  img: 'https://logowhistle.com/wp-content/uploads/2023/09/Logo-Design--Opus-Sustainability-Ventures-Inc-featured-image.jpg' },
    { title: 'Edge Entity',                      slug: 'edge-entity',                          order: 5,  img: 'https://logowhistle.com/wp-content/uploads/2023/09/Logo-Edge-Entity-featured_image.jpg' },
    { title: 'Organic Blends',                   slug: 'organic-blends',                       order: 6,  img: 'https://logowhistle.com/wp-content/uploads/2023/09/Logo-Design--Organic-Blends-featured-image.jpg' },
    { title: 'AspirityTech',                     slug: 'aspirity',                             order: 7,  img: 'https://logowhistle.com/wp-content/uploads/2023/09/Logo-Design-AspirityTech-featured_image.jpg' },
    { title: 'Elite Cardiovascular Group',       slug: 'elite-cardiovascular-group',           order: 8,  img: 'https://logowhistle.com/wp-content/uploads/2023/09/Logo_Elite-Cardiovascular-Group-featured-image.jpg' },
    { title: 'Small Town Girl',                  slug: 'small-town-girl',                      order: 9,  img: 'https://logowhistle.com/wp-content/uploads/2023/09/Logo-small-town-girl-featured-image.jpg' },
    { title: 'Minas Timber',                     slug: 'minas-timber',                         order: 10, img: 'https://logowhistle.com/wp-content/uploads/2023/09/Logo-Minas-Timber-featured-image.jpg' },
    { title: 'ESG Validation',                   slug: 'esg-validation',                       order: 11, img: 'https://logowhistle.com/wp-content/uploads/2023/09/Logo-ESG-Validation-featured-image.jpg' },
    { title: 'JC Barnett School of Jump Shooting',slug:'jc-barnett-school-of-jump-shooting',   order: 12, img: 'https://logowhistle.com/wp-content/uploads/2023/09/Logo-Design-JC-Barnett-featured-image.jpg' },
    { title: 'AJ Agro',                          slug: 'aj-agro',                              order: 13, img: 'https://logowhistle.com/wp-content/uploads/2023/09/Logo-Aj-Agro-featured-image.jpg' },
  ]
  for (const item of portfolioItems) {
    const imgId = await uploadImage(item.img, `portfolio-${item.slug}.jpg`)
    await postItem('portfolio-items', 'slug', item.slug, {
      title: item.title, slug: item.slug,
      featuredImage: imgId, displayOrder: item.order
    })
  }

  // ══════════════════════════════════════════
  // 4. PROCESS PAGE
  // ══════════════════════════════════════════
  console.log('\n[4/9] Process Page')
  const processImgId = await uploadImage(
    'https://logowhistle.com/wp-content/uploads/2023/09/process.jpg',
    'process-diagram.jpg'
  )
  await putSingle('process-page', {
    heroHeadline: 'The Logo Design Process',
    heroSubheadline: 'How we create logos that are both timeless and trendsetting',
    descriptionColumn1: "At LogoWhistle, our logo design process begins with a thorough exploration of your business, including its values, target audience, and unique attributes. This initial research provides the foundation for our creative journey. Moving forward, our talented designers brainstorm and sketch ideas until we discover the perfect concept that aligns with your brand's essence.\n\nWith the concept refined, we transition to digital design, utilizing design software and creative expertise to bring your logo to life. Every detail, from color selection to typography, is carefully considered to ensure the final logo effectively communicates your brand's message. LogoWhistle is dedicated to this process, delivering logos that truly stand out.",
    processImage: processImgId,
    helpRow1Text: "If you have a preliminary idea for your logo, whether it's described in words or sketched out, rest assured that our custom logo design company will bring it to life.",
    helpRow2Text: "Logos are almost always the first aspect of your business to grab customers' attention. Getting a logo-design job well done is all about effective communication. Help us understand your preferences in colors and patterns to get the output you desire. And get best logo design services from us.",
    helpRow3Text: "Our team will guide you through every step to ensure your brand identity is perfect."
  })

  // ══════════════════════════════════════════
  // 5. PRICING PAGE
  // ══════════════════════════════════════════
  console.log('\n[5/9] Pricing Page')
  await putSingle('pricing-page', {
    heroHeadline: 'Logo Design Pricing',
    heroSubheadline: 'A variety of logo design packages to fit your budget and needs',
    heroDescriptionLeft: 'LogoWhistle offers budget-friendly logo design solutions starting at just $195. Our versatile team can handle a wide range of design styles & requirements, ensuring we can cater to your specific design needs.',
    heroDescriptionRight: 'If you don\'t find a suitable match among our standard pricing options, feel free to contact us directly. Get in touch with us today to discuss your unique design requirements.',
    pricingTiers: [
      {
        plan_title: 'Basic',
        price: '$195',
        description: "Suitable for customers looking for logo only",
        button_text: 'Get Now',
        button_link: '/contact-us'
      },
      {
        plan_title: 'Economic',
        price: '$245',
        description: "Suitable for customers looking for logo & basic social media designs",
        button_text: 'Get Now',
        button_link: '/contact-us'
      },
      {
        plan_title: 'Brand',
        price: '$325',
        description: "Suitable for customers looking for complete logo and Branding package",
        button_text: 'Get Now',
        button_link: '/contact-us'
      }
    ]
  })

  // ══════════════════════════════════════════
  // 6. FAQ ITEMS
  // ══════════════════════════════════════════
  console.log('\n[6/9] FAQ Items')
  const faqs = [
    { order: 1, question: 'In general, what are the various phases in the whole custom logo designing process?', answer: 'The custom logo design process usually starts with the communication phase where a conversation (in a mode suitable for both parties) between the client and the designer would be arranged. This is then followed by the design phase and at the end of it, the client will be provided with the first draft of the complete logo.\n\nIn case of revisions, the client can ask for iterations of modification to the design until they get the desired output. If both parties are satisfied with the custom logo design output, the finishing processes will be initiated and the logo will be officially delivered to the client.' },
    { order: 2, question: 'What is the average turnaround time to get the custom logo design job done?', answer: 'Ideally, when the client has the clear picture of what they want, the entire process takes around 3-4 Days (Check Pricing Page for duration of each Package). Clear communication is the key to faster and better results so we would request the clients to help us in understanding the way forward.' },
    { order: 3, question: 'Is it really true that you offer unlimited revisions for the logo design?', answer: 'Except for the basic package, we offer unlimited revisions until the final delivery of the logo. No additional or hidden charges!' },
    { order: 4, question: 'What if I want some modifications once the logo has been delivered and launched?', answer: 'Our "unlimited revisions" offer will not be applicable for delivered logos because we are providing custom logo designs according to clients ideas. However, we can modify the logos with additional costs depending upon the work.' },
    { order: 5, question: 'How much will I be charged? Do you state price based on a package?', answer: 'In order to cater to all type of clients, we have developed 3 packages: Basic, Economic and Brand. The common thread for all the packages will be the superior quality of the final output as we believe that every logo is unique, not just in its design but also the thought process that goes into it. If you are interested to know a rough estimate for your requirements, this will be the place to start.' },
    { order: 6, question: 'When and how should the payment be made?', answer: 'We always prefer to receive the payment upfront - before the design phase. But don\'t worry! We always deliver better than we promise. Since we cater to custom logo design requests from all over the world, we accept USD for payment and we accept them via PayPal.' },
    { order: 7, question: 'How will the logos be delivered?', answer: 'Once the final touches are done, we will share the link to download the logo in email. The finished custom logo designs will be in one of these popular formats: EPS, PNG, JPG, AI, Source CorelDraw File. We would be glad to resize or reformat it as per your specifications.' },
    { order: 8, question: 'What if I am not satisfied with your work even after umpteen iterations?', answer: 'We would be sorry for letting you down and would try every avenue possible to make you happy. But if it is not working for you still, we will offer a 100% refund. Your satisfaction matters the most to us!' },
    { order: 9, question: 'Tell me about your copyright policies.', answer: 'Being a part of the designers\' ecosystem, we understand the importance of copyrights in our business. We assure you of a 100% unique design that will be just for your brand. Once the logo design has been delivered, you will be entitled with the complete ownership of that final product.\n\nWe would request you to allow us to showcase those designs in our portfolio (under your name) for our brand building purposes. However, we will still be the owners of the design ideas that were rejected by you during the process.' },
    { order: 10, question: 'Is my business information safe with you?', answer: 'Maintaining high standards of business ethics is of utmost importance to us. We assure that any type of business information that you share with us during our course of work will be treated with dignity and will not be used or shared with anyone else.' },
    { order: 11, question: 'I am impressed with your works. Do you offer any other web-related services?', answer: 'Yes! We do. We offer services like website design, redesign, development, CMS, Social Media marketing etc. under our parent concern ColorWhistle.\n\nOur group operates from the city of Coimbatore in India and we serve clients from all over the world. Join our family and we will assure you that you need not look anywhere further for web-related services, ever!' },
  ]
  for (const faq of faqs) {
    await postItem('faq-items', 'question', faq.question.slice(0, 40), {
      question: faq.question, answer: faq.answer, displayOrder: faq.order
    })
  }

  // ══════════════════════════════════════════
  // 7. BLOG POSTS (all 4 pages)
  // ══════════════════════════════════════════
  console.log('\n[7/9] Blog Posts')
  const blogPosts = [
    // PAGE 1
    { title: '30+ Inspiring Logo Designs for Non-Profit Organizations', slug: 'non-profit-organizations-logo-design', date: '2024-06-26', page: 1, img: 'https://logowhistle.com/wp-content/uploads/2024/06/30-Inspiring-Logo-Designs-for-Non-Profit-Organizations-Featured-Image-LogoWhistle.jpg' },
    { title: '15+ Essential Logo Design Tips for Beginners',            slug: 'logo-design-tips-for-beginners',       date: '2024-06-10', page: 1, img: 'https://logowhistle.com/wp-content/uploads/2024/06/15-Essential-Logo-Design-Tips-For-Beginners-Featured-Image-LogoWhistle.jpg' },
    { title: 'Logo Design in E-commerce',                              slug: 'e-commerce-logo-design',               date: '2024-05-16', page: 1, img: 'https://logowhistle.com/wp-content/uploads/2024/05/Logo-Design-in-E-commerce-Featured-Image-LogoWhistle.jpg' },
    { title: '5+ Healthcare Branding and Creating Trust through Logo Design', slug: 'healthcare-logo-design-ideas',  date: '2024-04-29', page: 1, img: 'https://logowhistle.com/wp-content/uploads/2024/04/Healthcare-Branding-and-Creating-Trust-through-Logo-Design-Featured-Image-LogoWhistle.jpg' },
    { title: 'Evolution Of Logos Over Time – Transforming Brand Identity', slug: 'evolution-of-logos',              date: '2024-04-04', page: 1, img: 'https://logowhistle.com/wp-content/uploads/2024/04/Evolution-of-Logos-Featured-Image-LogoWhistle.png' },
    { title: 'Nature-Inspired Logo Designs for a Fresh Brand Image',   slug: 'nature-inspired-logo-design-ideas',   date: '2024-03-29', page: 1, img: 'https://logowhistle.com/wp-content/uploads/2024/03/Nature-Inspired-Logo-Designs-Featured-Image-LogoWhistle.jpg' },
    { title: 'The Role of Logo Design in UX/UI',                       slug: 'logo-design-role-in-ux-ui',           date: '2024-02-27', page: 1, img: 'https://logowhistle.com/wp-content/uploads/2024/02/The-Role-of-Logo-Design-in-UXUI-Featured-Image-LogoWhistle.jpg' },
    { title: 'Logo Design Approaches Across Industries',               slug: 'logo-design-approaches-across-industries', date: '2024-02-09', page: 1, img: 'https://logowhistle.com/wp-content/uploads/2024/02/Logo-Design-Approaches-Across-Industries-Featured-Image-LogoWhistle.jpg' },
    { title: 'Logo Design Essentials for Luxury Brand Logos',          slug: 'luxury-logo-design-essentials',       date: '2024-01-25', page: 1, img: 'https://logowhistle.com/wp-content/uploads/2024/01/Logo-Design-Essentials-for-Luxury-Brand-Logos-Featured-Image-LogoWhistle.jpg' },
    { title: 'Hidden Meanings Behind Famous Logos',                    slug: 'hidden-meanings-behind-famous-logos', date: '2024-01-18', page: 1, img: 'https://logowhistle.com/wp-content/uploads/2024/01/Hidden-Meanings-Behind-Famous-Logos-Featured-Image-LogoWhistle.jpg' },
    { title: 'Logo Design Case Studies: Deconstructing Successful Logos', slug: 'logo-design-case-studies',        date: '2024-01-17', page: 1, img: 'https://logowhistle.com/wp-content/uploads/2024/01/Logo-Design-Case-Studies-Featured-Image-LogoWhistle.jpg' },
    { title: "Logo Design Trends 2024: What's In and What's Out",      slug: 'logo-design-trends',                  date: '2024-01-11', page: 1, img: 'https://logowhistle.com/wp-content/uploads/2024/01/Logo-Design-Trends-in-2024-Whats-in-and-out-Featured-Image-LogoWhistle-1.jpg' },
    // PAGE 2
    { title: 'Startup Logo Design Tips: Creating a Lasting First Impression', slug: 'startup-logo-design-tips',    date: '2024-01-04', page: 2, img: 'https://logowhistle.com/wp-content/uploads/2024/01/Logo-Design-Tips-for-Startups-Creating-A-Lasting-First-Impression-Featured-Image-LogoWhistle.png' },
    { title: "Do's and Don'ts of Logo Design: Common Mistakes to Avoid", slug: 'logo-design-mistakes-to-avoid',   date: '2023-12-20', page: 2, img: 'https://logowhistle.com/wp-content/uploads/2023/12/Dos-and-Donts-of-Logo-Design-Featured-Image-LogoWhistle.jpg' },
    { title: 'Creating a Timeless Logo: Strategies for Lasting Brand Identity', slug: 'creating-timeless-logo',   date: '2023-12-12', page: 2, img: 'https://logowhistle.com/wp-content/uploads/2023/12/Creating-a-Timeless-Logo-Featured-Image-LogoWhistle.jpg' },
    { title: 'From Helvetica to Futura: 10 Fonts That Rule Iconic Logos', slug: 'best-fonts-for-logos',           date: '2023-12-01', page: 2, img: 'https://logowhistle.com/wp-content/uploads/2023/12/Best-Fonts-for-Logos-Featured-Image-LogoWhistle.jpg' },
    { title: 'Rebranding Done Right: Logo Redesign Tips From The Experts', slug: 'logo-rebranding-tips',          date: '2023-11-27', page: 2, img: 'https://logowhistle.com/wp-content/uploads/2023/11/Logo-Rebranding-Tips-Featured-Image-LogoWhistle.jpg' },
    { title: '10+ Restaurant Logo Design: A Taste of Brand Excellence', slug: 'restaurant-logo-design',           date: '2023-11-17', page: 2, img: 'https://logowhistle.com/wp-content/uploads/2023/11/Restaurant-Logo-Design-Featured-Image-LogoWhistle.jpg' },
    { title: 'Logo Psychology: How Shapes and Colors Influence Brand Perception', slug: 'logo-psychology',        date: '2023-11-06', page: 2, img: 'https://logowhistle.com/wp-content/uploads/2023/11/Logo-Psychology-Featured-Image-LogoWhistle.jpg' },
    { title: 'Real Estate Logo Design: What Makes a Property Brand Stand Out', slug: 'real-estate-logo-design',   date: '2023-10-25', page: 2, img: 'https://logowhistle.com/wp-content/uploads/2023/10/Real-Estate-Logo-Design-Featured-Image-LogoWhistle.jpg' },
    { title: 'Sports Logo Design: The Art of Creating Winning Team Identities', slug: 'sports-logo-design',       date: '2023-10-17', page: 2, img: 'https://logowhistle.com/wp-content/uploads/2023/10/Sports-Logo-Design-Featured-Image-LogoWhistle.jpg' },
    { title: 'Law Firm Logo Design: Building Trust and Authority',     slug: 'law-firm-logo-design',              date: '2023-10-09', page: 2, img: 'https://logowhistle.com/wp-content/uploads/2023/10/Law-Firm-Logo-Design-Featured-Image-LogoWhistle.jpg' },
    { title: 'Technology Logo Design: Creating a Modern Brand Identity', slug: 'technology-logo-design',          date: '2023-10-02', page: 2, img: 'https://logowhistle.com/wp-content/uploads/2023/10/Technology-Logo-Design-Featured-Image-LogoWhistle.jpg' },
    { title: 'Fashion Logo Design: Style Meets Strategy',             slug: 'fashion-logo-design',                date: '2023-09-22', page: 2, img: 'https://logowhistle.com/wp-content/uploads/2023/09/Fashion-Logo-Design-Featured-Image-LogoWhistle.jpg' },
    // PAGE 3
    { title: 'Text Logo Designs That Will Win You Customers',          slug: 'text-logo-designs',                  date: '2018-06-04', page: 3, img: 'https://logowhistle.com/wp-content/uploads/2023/05/Text-Logo-Designs-That-Will-Win-You-Customers-LogoWhistle-1.jpg' },
    { title: 'Most Iconic Band And Music Logo Designs',                slug: 'music-band-logo-design',             date: '2018-05-28', page: 3, img: 'https://logowhistle.com/wp-content/uploads/2023/05/Most-Iconic-Band-And-Music-Logo-Designs-LogoWhistle.jpg' },
    { title: 'Church Logo Design Ideas And Inspirations',              slug: 'church-logo-design',                 date: '2018-05-17', page: 3, img: 'https://logowhistle.com/wp-content/uploads/2023/05/Church-Logo-Design-Ideas-And-Inspirations-LogoWhistle.jpg' },
    { title: '80+ Best Photography Logo Designs Ideas',                slug: 'photography-logo-design-ideas',      date: '2018-04-24', page: 3, img: 'https://logowhistle.com/wp-content/uploads/2023/05/80-Best-Photography-Logo-Designs-Ideas-LogoWhistle.jpg' },
    { title: 'Fitness Logo Design Ideas and Inspirations',             slug: 'fitness-logo-design',                date: '2018-04-17', page: 3, img: 'https://logowhistle.com/wp-content/uploads/2023/05/Fitness-Logo-Design-Ideas-and-Inspirations-LogoWhistle.jpg' },
    // PAGE 4
    { title: 'Illustrator for Beginners – A Complete Guide To Create Highly Professional Designs', slug: 'illustrator-for-beginners', date: '2016-06-02', page: 4, img: 'https://logowhistle.com/wp-content/uploads/2023/05/Illustrator-for-Beginners-A-Complete-Guide-To-Create-Highly-Professional-Designs-LogoWhistle.jpg' },
    { title: 'White Label Graphic Design Services',                    slug: 'white-label-graphic-design-services', date: '2016-05-27', page: 4, img: 'https://logowhistle.com/wp-content/uploads/2023/05/White-Label-Graphic-Design-Services-LogoWhistle.jpg' },
    { title: 'The Psychology Of Colors In Logo Design',               slug: 'color-psychology-in-logo-design',     date: '2016-05-23', page: 4, img: 'https://logowhistle.com/wp-content/uploads/2023/05/The-Psychology-Of-Colors-In-Logo-Design-LogoWhistle.jpg' },
    { title: 'Branding vs Logo Design – Understanding the Crucial Differences', slug: 'branding-vs-logo-design',  date: '2016-05-14', page: 4, img: 'https://logowhistle.com/wp-content/uploads/2023/05/Branding-vs-Logo-Design-Understanding-the-Crucial-Differences-LogoWhistle.jpg' },
    { title: '10 Iconic Indian Logo Designs',                          slug: 'indian-logo-designs',                date: '2016-05-05', page: 4, img: 'https://logowhistle.com/wp-content/uploads/2023/05/10-Iconic-Indian-Logo-Designs-LogoWhistle.jpg' },
  ]
  for (const post of blogPosts) {
    const imgId = await uploadImage(post.img, `blog-${post.slug}.${post.img.endsWith('.png') ? 'png' : 'jpg'}`)
    await postItem('blog-posts', 'slug', post.slug, {
      title: post.title, slug: post.slug,
      publishedDate: post.date, author: 'SEO Admin',
      category: 'Logo Design', featuredImage: imgId,
      pageNumber: post.page, excerpt: ''
    })
    await new Promise(r => setTimeout(r, 200))
  }

  // ══════════════════════════════════════════
  // 8. CONTACT PAGE
  // ══════════════════════════════════════════
  console.log('\n[8/9] Contact Page')
  await putSingle('contact-page', {
    pageTitle: 'Contact Us.',
    pageSubtitle: "Drop Us a Line: We're Excited to Connect",
    address: 'LEO Towers, 60/10, Sathy Main road, Ganapathy, Coimbatore, TN, India.',
    phone1: '+91 (422).420.2825',
    phone2: '+1 (201).918.4295',
    email: 'hi@logowhistle.com',
    formDescription: "We'd love to help. Just leave your details below, we will whistle back shortly."
  })

  console.log('\n✅ MASTER SEED COMPLETE!\n')
}

seed().catch(e => { console.error('❌ Seed failed:', e); process.exit(1) })
