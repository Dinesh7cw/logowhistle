const fetch = require('node-fetch')
const cheerio = require('cheerio')

const STRAPI = 'http://localhost:1337'

async function scrapeBlog() {
  console.log('\n🕵️ BLOG SCRAPER STARTING...\n')

  const pages = [
    'https://logowhistle.com/blog/',
    'https://logowhistle.com/blog/page/2/',
    'https://logowhistle.com/blog/page/3/',
    'https://logowhistle.com/blog/page/4/'
  ]

  const links = new Set()

  for (const pageUrl of pages) {
    console.log(`📄 Indexing page: ${pageUrl}...`)
    try {
      const res = await fetch(pageUrl, { headers: { 'User-Agent': 'Mozilla/5.0' } })
      if (!res.ok) continue
      const html = await res.text()
      const $ = cheerio.load(html)
      
      $('a').each((i, el) => {
        const href = $(el).attr('href')
        if (href && href.startsWith('https://logowhistle.com/')) {
          const cleanUrl = href.split('?')[0].replace(/\/$/, '') + '/'
          const slug = cleanUrl.replace('https://logowhistle.com/', '').replace(/\/$/, '')
          
          // Exclude known pages and pagination
          const isPage = ['blog', 'contact-us', 'pricing', 'process', 'portfolio', 'faq', 'logo-design-process', 'logo-design-pricing', 'logo-design-faq', 'privacy-policy', 'terms-and-conditions'].includes(slug)
          const isPagination = cleanUrl.includes('/page/')
          const isHome = cleanUrl === 'https://logowhistle.com/'

          if (!isPage && !isPagination && !isHome && slug.length > 3) {
            links.add(cleanUrl)
          }
        }
      })
    } catch (e) {
      console.error(`  ❌ Error indexing ${pageUrl}:`, e.message)
    }
  }

  console.log(`\n✅ Found ${links.size} unique blog links. Starting content extraction...\n`)

  for (const url of links) {
    const slug = url.replace(/\/$/, '').split('/').pop()
    console.log(`🔎 Scraping: ${slug}...`)

    try {
      // Find the post ID in Strapi first
      const strapiRes = await fetch(`${STRAPI}/api/blog-posts?filters[slug][$eq]=${slug}`)
      const { data: strapiData } = await strapiRes.json()
      
      if (!strapiData || strapiData.length === 0) {
        console.warn(`  ⏭ Slug not found in Strapi: ${slug}`)
        continue
      }
      
      const documentId = strapiData[0].documentId // Using documentId for Strapi 5 PUT

      const pageRes = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' } })
      if (!pageRes.ok) { console.warn(`  ⚠ Failed to fetch: ${url}`); continue }
      
      const html = await pageRes.text()
      const $ = cheerio.load(html)
      
      // Select content
      const content = $('.entry-content').html() || $('.post-content').html() || $('article').html() || $('.content').html() || $('.post').html() || ''
      let excerpt = $('.entry-content p').first().text().trim()
      if (excerpt.length > 200) excerpt = excerpt.slice(0, 197) + '...'

      if (content) {
        const updateRes = await fetch(`${STRAPI}/api/blog-posts/${documentId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ data: { sections: [{ __component: 'sections.content', content }], excerpt } })
        })
        if (updateRes.ok) {
          console.log(`  ✅ Scraped & Updated: ${slug}`)
        } else {
          const err = await updateRes.json()
          console.error(`  ❌ Failed to update Strapi for ${slug}:`, JSON.stringify(err))
        }
      } else {
        console.warn(`  ⚠ No content found for: ${slug}`)
      }
    } catch (e) {
      console.error(`  ❌ Error processing ${slug}:`, e.message)
    }
    await new Promise(r => setTimeout(r, 300))
  }

  console.log('\n✅ BLOG RESTORATION COMPLETE!\n')
}

scrapeBlog().catch(console.error)
