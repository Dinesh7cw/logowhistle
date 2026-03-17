import type { Schema, Struct } from '@strapi/strapi';

export interface PricingPricingPlan extends Struct.ComponentSchema {
  collectionName: 'components_pricing_pricing_plans';
  info: {
    description: '';
    displayName: 'Pricing Plan';
  };
  attributes: {
    button_link: Schema.Attribute.String;
    button_text: Schema.Attribute.String;
    description: Schema.Attribute.Text;
    features: Schema.Attribute.Component<'shared.text-item', true>;
    plan_title: Schema.Attribute.String;
    price: Schema.Attribute.String;
  };
}

export interface PricingTier extends Struct.ComponentSchema {
  collectionName: 'components_pricing_tiers';
  info: {
    description: '';
    displayName: 'Tier';
    icon: 'bulletList';
  };
  attributes: {
    buttonLabel: Schema.Attribute.String &
      Schema.Attribute.DefaultTo<'Get Now'>;
    buttonUrl: Schema.Attribute.String;
    packageFeatures: Schema.Attribute.Text;
    packageIcon: Schema.Attribute.Media<'images'>;
    packageName: Schema.Attribute.String & Schema.Attribute.Required;
    packagePrice: Schema.Attribute.String;
    packageTagline: Schema.Attribute.String;
  };
}

export interface SectionsAbout extends Struct.ComponentSchema {
  collectionName: 'components_sections_about_sections';
  info: {
    description: '';
    displayName: 'About Section';
  };
  attributes: {
    leftDescription: Schema.Attribute.Text;
    rightDescription: Schema.Attribute.Text;
  };
}

export interface SectionsAlsoRead extends Struct.ComponentSchema {
  collectionName: 'components_sections_also_reads';
  info: {
    description: 'Horizontal link section with top and bottom borders';
    displayName: 'Also Read';
  };
  attributes: {
    label: Schema.Attribute.String & Schema.Attribute.DefaultTo<'Also Read'>;
    linkText: Schema.Attribute.String & Schema.Attribute.Required;
    linkUrl: Schema.Attribute.String & Schema.Attribute.Required;
    section_title: Schema.Attribute.String;
  };
}

export interface SectionsArticle extends Struct.ComponentSchema {
  collectionName: 'components_sections_articles';
  info: {
    description: 'Rich text section using native Strapi 5 Blocks editor';
    displayName: 'Article Section';
  };
  attributes: {
    content: Schema.Attribute.Blocks;
    section_title: Schema.Attribute.String;
  };
}

export interface SectionsBlogQuote extends Struct.ComponentSchema {
  collectionName: 'components_sections_blog_quotes';
  info: {
    description: 'Large grey quotation icon with text';
    displayName: 'Blog Quote';
  };
  attributes: {
    icon: Schema.Attribute.Media<'images'>;
    section_title: Schema.Attribute.String;
    text: Schema.Attribute.Text & Schema.Attribute.Required;
  };
}

export interface SectionsContact extends Struct.ComponentSchema {
  collectionName: 'components_sections_contacts';
  info: {
    displayName: 'Contact Section';
  };
  attributes: {
    address: Schema.Attribute.Text;
    email: Schema.Attribute.Email;
    form_description: Schema.Attribute.Text;
    phone: Schema.Attribute.String;
    section_title: Schema.Attribute.String;
  };
}

export interface SectionsContent extends Struct.ComponentSchema {
  collectionName: 'components_sections_contents';
  info: {
    description: '';
    displayName: 'Content Section';
  };
  attributes: {
    content: Schema.Attribute.Text;
    image: Schema.Attribute.Media<'images'>;
    title: Schema.Attribute.String;
  };
}

export interface SectionsCta extends Struct.ComponentSchema {
  collectionName: 'components_sections_ctas';
  info: {
    description: '';
    displayName: 'CTA Section';
  };
  attributes: {
    buttonLabel: Schema.Attribute.String;
    buttonUrl: Schema.Attribute.String;
    description: Schema.Attribute.Text;
    title: Schema.Attribute.String;
  };
}

export interface SectionsEqualGrid extends Struct.ComponentSchema {
  collectionName: 'components_sections_equal_grids';
  info: {
    displayName: 'Equal Grid Section';
  };
  attributes: {
    grid_items: Schema.Attribute.Component<'shared.item-with-image', true>;
    section_title: Schema.Attribute.String;
  };
}

export interface SectionsExpertiseContent extends Struct.ComponentSchema {
  collectionName: 'components_sections_expertise_contents';
  info: {
    displayName: 'Expertise Content Section';
  };
  attributes: {
    expertise_items: Schema.Attribute.Component<'shared.item-with-image', true>;
    section_title: Schema.Attribute.String;
  };
}

export interface SectionsFaq extends Struct.ComponentSchema {
  collectionName: 'components_sections_faqs';
  info: {
    description: 'A reusable FAQ section with selectable items';
    displayName: 'FAQ Section';
  };
  attributes: {
    faqs: Schema.Attribute.Relation<'oneToMany', 'api::faq-item.faq-item'>;
    showAll: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    title: Schema.Attribute.String;
  };
}

export interface SectionsFilledBox extends Struct.ComponentSchema {
  collectionName: 'components_sections_filled_boxes';
  info: {
    description: 'Repeating linear gradient background with centered text';
    displayName: 'Filled Box';
  };
  attributes: {
    section_title: Schema.Attribute.String;
    text: Schema.Attribute.Text & Schema.Attribute.Required;
  };
}

export interface SectionsGallery extends Struct.ComponentSchema {
  collectionName: 'components_sections_galleries';
  info: {
    description: '';
    displayName: 'Gallery Section';
  };
  attributes: {
    images: Schema.Attribute.Media<'images', true> & Schema.Attribute.Required;
    section_title: Schema.Attribute.String;
  };
}

export interface SectionsHero extends Struct.ComponentSchema {
  collectionName: 'components_sections_heros';
  info: {
    description: '';
    displayName: 'Hero Section';
  };
  attributes: {
    boldWord: Schema.Attribute.String;
    dividerImage: Schema.Attribute.Media<'images'>;
    headline: Schema.Attribute.String;
    leftDescription: Schema.Attribute.Text;
    rightDescription: Schema.Attribute.Text;
    subheadline: Schema.Attribute.String;
  };
}

export interface SectionsHeroIntro extends Struct.ComponentSchema {
  collectionName: 'components_sections_hero_intros';
  info: {
    description: '';
    displayName: 'Hero Intro Section';
  };
  attributes: {
    background_image: Schema.Attribute.Media<'images'>;
    button_link: Schema.Attribute.String;
    button_text: Schema.Attribute.String;
    description: Schema.Attribute.Text;
    subtitle: Schema.Attribute.String;
    title: Schema.Attribute.String;
  };
}

export interface SectionsImage extends Struct.ComponentSchema {
  collectionName: 'components_sections_image_sections';
  info: {
    displayName: 'Image Section';
  };
  attributes: {
    image: Schema.Attribute.Media<'images'> & Schema.Attribute.Required;
    linkText: Schema.Attribute.String;
    linkUrl: Schema.Attribute.String;
    openInNewTab: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    section_title: Schema.Attribute.String;
  };
}

export interface SectionsImageRepeater extends Struct.ComponentSchema {
  collectionName: 'components_sections_image_repeaters';
  info: {
    displayName: 'Image Repeater Section';
  };
  attributes: {
    images: Schema.Attribute.Media<'images', true> & Schema.Attribute.Required;
    section_title: Schema.Attribute.String;
  };
}

export interface SectionsImageText extends Struct.ComponentSchema {
  collectionName: 'components_sections_image_and_texts';
  info: {
    displayName: 'Image and Text Section';
  };
  attributes: {
    button_link: Schema.Attribute.String;
    button_text: Schema.Attribute.String;
    description: Schema.Attribute.Text;
    image: Schema.Attribute.Media<'images'> & Schema.Attribute.Required;
    title: Schema.Attribute.String;
  };
}

export interface SectionsImageTextHighlighted extends Struct.ComponentSchema {
  collectionName: 'components_sections_image_and_text_highlighteds';
  info: {
    displayName: 'Image and Text Highlighted Section';
  };
  attributes: {
    button_link: Schema.Attribute.String;
    button_text: Schema.Attribute.String;
    description: Schema.Attribute.Text;
    highlighted_text: Schema.Attribute.String;
    image: Schema.Attribute.Media<'images'> & Schema.Attribute.Required;
    title: Schema.Attribute.String;
  };
}

export interface SectionsPricing extends Struct.ComponentSchema {
  collectionName: 'components_sections_pricings';
  info: {
    description: '';
    displayName: 'Pricing Section';
  };
  attributes: {
    pricing_items: Schema.Attribute.Component<'pricing.pricing-plan', true>;
    section_title: Schema.Attribute.String;
  };
}

export interface SectionsPricingTiers extends Struct.ComponentSchema {
  collectionName: 'components_sections_pricing_tiers';
  info: {
    description: '';
    displayName: 'Pricing Tiers Section';
  };
  attributes: {
    section_title: Schema.Attribute.String;
    tiers: Schema.Attribute.Component<'pricing.tier', true>;
  };
}

export interface SectionsQuote extends Struct.ComponentSchema {
  collectionName: 'components_sections_quotes';
  info: {
    displayName: 'Quote Section';
  };
  attributes: {
    author: Schema.Attribute.String;
    author_title: Schema.Attribute.String;
    quote_text: Schema.Attribute.RichText & Schema.Attribute.Required;
  };
}

export interface SectionsSlider extends Struct.ComponentSchema {
  collectionName: 'components_sections_sliders';
  info: {
    displayName: 'Slider Section';
  };
  attributes: {
    slides: Schema.Attribute.Component<'shared.slide', true>;
  };
}

export interface SectionsTextHighlighted extends Struct.ComponentSchema {
  collectionName: 'components_sections_text_highlighteds';
  info: {
    displayName: 'Text Highlighted Section';
  };
  attributes: {
    description: Schema.Attribute.Text;
    highlighted_text: Schema.Attribute.String;
    title: Schema.Attribute.String;
  };
}

export interface SectionsThankYou extends Struct.ComponentSchema {
  collectionName: 'components_sections_thank_yous';
  info: {
    displayName: 'Thank You Section';
  };
  attributes: {
    button_link: Schema.Attribute.String;
    button_text: Schema.Attribute.String;
    description: Schema.Attribute.Text;
    title: Schema.Attribute.String;
  };
}

export interface SectionsThreeColumnImgContent extends Struct.ComponentSchema {
  collectionName: 'components_sections_three_column_image_and_contents';
  info: {
    displayName: 'Three Column Image and Content Section';
  };
  attributes: {
    items: Schema.Attribute.Component<'shared.item-with-image', true>;
    section_title: Schema.Attribute.String;
  };
}

export interface SectionsTwoColumnImage extends Struct.ComponentSchema {
  collectionName: 'components_sections_two_column_images';
  info: {
    displayName: 'Two Column Image Section';
  };
  attributes: {
    caption: Schema.Attribute.String;
    image_left: Schema.Attribute.Media<'images'> & Schema.Attribute.Required;
    image_right: Schema.Attribute.Media<'images'> & Schema.Attribute.Required;
  };
}

export interface SectionsTwoColumnImgContent extends Struct.ComponentSchema {
  collectionName: 'components_sections_two_column_image_and_contents';
  info: {
    displayName: 'Two Column Image and Content Section';
  };
  attributes: {
    button_link: Schema.Attribute.String;
    button_text: Schema.Attribute.String;
    description: Schema.Attribute.Text;
    image: Schema.Attribute.Media<'images'> & Schema.Attribute.Required;
    image_position: Schema.Attribute.Enumeration<['left', 'right']> &
      Schema.Attribute.DefaultTo<'left'>;
    title: Schema.Attribute.String;
  };
}

export interface SectionsUnsequencedGrid extends Struct.ComponentSchema {
  collectionName: 'components_sections_unequal_grids';
  info: {
    displayName: 'Unsequenced Grid Section';
  };
  attributes: {
    grid_items: Schema.Attribute.Component<'shared.item-with-image', true>;
    section_title: Schema.Attribute.String;
  };
}

export interface SharedItemWithImage extends Struct.ComponentSchema {
  collectionName: 'components_shared_item_with_images';
  info: {
    displayName: 'Item with Image';
  };
  attributes: {
    description: Schema.Attribute.Text;
    image: Schema.Attribute.Media<'images'>;
  };
}

export interface SharedNavLink extends Struct.ComponentSchema {
  collectionName: 'components_shared_nav_links';
  info: {
    displayName: 'Nav Link';
    icon: 'link';
  };
  attributes: {
    href: Schema.Attribute.String & Schema.Attribute.Required;
    label: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface SharedSlide extends Struct.ComponentSchema {
  collectionName: 'components_shared_slides';
  info: {
    displayName: 'Slide';
  };
  attributes: {
    button_link: Schema.Attribute.String;
    button_text: Schema.Attribute.String;
    description: Schema.Attribute.Text;
    image: Schema.Attribute.Media<'images'>;
    title: Schema.Attribute.String;
  };
}

export interface SharedTextItem extends Struct.ComponentSchema {
  collectionName: 'components_shared_text_items';
  info: {
    displayName: 'Text Item';
  };
  attributes: {
    value: Schema.Attribute.String;
  };
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'pricing.pricing-plan': PricingPricingPlan;
      'pricing.tier': PricingTier;
      'sections.about': SectionsAbout;
      'sections.also-read': SectionsAlsoRead;
      'sections.article': SectionsArticle;
      'sections.blog-quote': SectionsBlogQuote;
      'sections.contact': SectionsContact;
      'sections.content': SectionsContent;
      'sections.cta': SectionsCta;
      'sections.equal-grid': SectionsEqualGrid;
      'sections.expertise-content': SectionsExpertiseContent;
      'sections.faq': SectionsFaq;
      'sections.filled-box': SectionsFilledBox;
      'sections.gallery': SectionsGallery;
      'sections.hero': SectionsHero;
      'sections.hero-intro': SectionsHeroIntro;
      'sections.image': SectionsImage;
      'sections.image-repeater': SectionsImageRepeater;
      'sections.image-text': SectionsImageText;
      'sections.image-text-highlighted': SectionsImageTextHighlighted;
      'sections.pricing': SectionsPricing;
      'sections.pricing-tiers': SectionsPricingTiers;
      'sections.quote': SectionsQuote;
      'sections.slider': SectionsSlider;
      'sections.text-highlighted': SectionsTextHighlighted;
      'sections.thank-you': SectionsThankYou;
      'sections.three-column-img-content': SectionsThreeColumnImgContent;
      'sections.two-column-image': SectionsTwoColumnImage;
      'sections.two-column-img-content': SectionsTwoColumnImgContent;
      'sections.unsequenced-grid': SectionsUnsequencedGrid;
      'shared.item-with-image': SharedItemWithImage;
      'shared.nav-link': SharedNavLink;
      'shared.slide': SharedSlide;
      'shared.text-item': SharedTextItem;
    }
  }
}
