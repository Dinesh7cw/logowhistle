// import type { Core } from '@strapi/strapi';

export default {
  register() {},

  async bootstrap({ strapi }: { strapi: any }) {
    const publicRole = await strapi.db.query('plugin::users-permissions.role').findOne({ 
      where: { type: 'public' } 
    });

    if (!publicRole) return;

    const contentTypes = [
      { uid: 'api::global.global', actions: ['find', 'findOne'] },
      { uid: 'api::homepage.homepage', actions: ['find', 'findOne'] },
      { uid: 'api::portfolio-item.portfolio-item', actions: ['find', 'findOne'] },
      { uid: 'api::portfolio-page.portfolio-page', actions: ['find', 'findOne'] },
      { uid: 'api::process-page.process-page', actions: ['find', 'findOne'] },
      { uid: 'api::pricing-page.pricing-page', actions: ['find', 'findOne'] },
      { uid: 'api::faq-item.faq-item', actions: ['find', 'findOne'] },
      { uid: 'api::blog-post.blog-post', actions: ['find', 'findOne'] },
      { uid: 'api::blog-page.blog-page', actions: ['find', 'findOne'] },
      { uid: 'api::contact-page.contact-page', actions: ['find', 'findOne'] },
      { uid: 'api::contact-inquiry.contact-inquiry', actions: ['create'] },
    ];

    for (const ct of contentTypes) {
      for (const actionName of ct.actions) {
        const actionString = `${ct.uid}.${actionName}`;
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
