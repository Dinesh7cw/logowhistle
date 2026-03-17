// import type { Core } from '@strapi/strapi';

export default {
  register() {},

  async bootstrap({ strapi }: { strapi: any }) {
    const publicRole = await strapi.db.query('plugin::users-permissions.role').findOne({ 
      where: { type: 'public' } 
    });

    if (!publicRole) return;

    const contentTypes = [
      'api::global.global',
      'api::homepage.homepage',
      'api::portfolio-item.portfolio-item',
      'api::portfolio-page.portfolio-page',
      'api::process-page.process-page',
      'api::pricing-page.pricing-page',
      'api::faq-item.faq-item',
      'api::blog-post.blog-post',
      'api::blog-page.blog-page',
      'api::contact-page.contact-page',
    ];

    const actions = ['find', 'findOne', 'create', 'update'];

    for (const ct of contentTypes) {
      for (const action of actions) {
        const actionString = `${ct}.${action}`;
        const existing = await strapi.db.query('plugin::users-permissions.permission').findOne({
          where: { action: actionString, role: publicRole.id }
        });

        if (existing) {
          await strapi.db.query('plugin::users-permissions.permission').update({
            where: { id: existing.id },
            data: { enabled: true }
          });
        } else {
          await strapi.db.query('plugin::users-permissions.permission').create({
            data: { action: actionString, role: publicRole.id, enabled: true },
          });
        }
      }
    }
    console.log('✅ Public permissions updated in bootstrap');
  },
};
