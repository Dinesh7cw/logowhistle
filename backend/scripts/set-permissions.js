'use strict'

async function setPermissions() {
  const appDir = process.cwd();
  const distDir = require('path').join(appDir, 'dist');
  const strapi = await require('@strapi/strapi').createStrapi({ appDir, distDir }).load()

  const publicRole = await strapi
    .query('plugin::users-permissions.role')
    .findOne({ where: { type: 'public' }, populate: ['permissions'] })

  const contentTypes = [
    'api::global.global',
    'api::homepage.homepage',
    'api::portfolio-item.portfolio-item',
    'api::process-page.process-page',
    'api::pricing-page.pricing-page',
    'api::faq-item.faq-item',
    'api::blog-post.blog-post',
    'api::contact-page.contact-page',
  ]

  for (const ct of contentTypes) {
    const actions = ['find', 'findOne', 'create', 'update']
    for (const action of actions) {
      const existing = await strapi.db.query('plugin::users-permissions.permission').findOne({
        where: { action: `${ct}.${action}`, role: publicRole.id }
      })

      if (existing) {
        await strapi.db.query('plugin::users-permissions.permission').update({
          where: { id: existing.id },
          data: { enabled: true }
        })
      } else {
        await strapi.db.query('plugin::users-permissions.permission').create({
          data: { action: `${ct}.${action}`, role: publicRole.id, enabled: true },
        })
      }
    }
  }

  console.log('✅ Public permissions set for all content types')
  await strapi.destroy()
  process.exit(0)
}

setPermissions().catch(e => { console.error(e); process.exit(1) })
