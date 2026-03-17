const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://127.0.0.1:1337';

export async function fetchStrapi(endpoint: string, options: any = {}, returnMeta: boolean = false) {
  const res = await fetch(`${STRAPI_URL}/api/${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    next: { revalidate: 3600 }, // Enable revalidation for production
  });

  if (!res.ok) {
    const text = await res.text();
    console.error(`Strapi Fetch Error (${res.status}):`, text.slice(0, 500));
    throw new Error(`Failed to fetch from Strapi: ${res.statusText} (${res.status})`);
  }

  const json = await res.json();
  
  if (returnMeta) {
    return json;
  }
  
  return json.data;
}

export function getStrapiMedia(media: any) {
  if (!media) return null;
  // If media is a string, use it directly as the URL. Otherwise access .url
  const url = typeof media === 'string' ? media : (media.url || media.data?.url || media.data?.attributes?.url || null);
  if (!url) return null;
  if (url.startsWith('http')) return url;
  return `${STRAPI_URL}${url}`;
}
// Universal population string for all dynamic zone components and their nested media/relations
// Optimized for Strapi 5 dynamic zones to ensure all components and their media/relations are fetched
export const UNIVERSAL_POPULATE = [
  'populate[sections][on][sections.blog-quote][populate]=*',
  'populate[sections][on][sections.filled-box][populate]=*',
  'populate[sections][on][sections.also-read][populate]=*',
  'populate[sections][on][sections.article][populate]=*',
  'populate[sections][on][sections.hero][populate]=*',
  'populate[sections][on][sections.hero-intro][populate]=*',
  'populate[sections][on][sections.gallery][populate]=*',
  'populate[sections][on][sections.image-repeater][populate]=*',
  'populate[sections][on][sections.content][populate]=*',
  'populate[sections][on][sections.pricing][populate]=*',
  'populate[sections][on][sections.pricing-tiers][populate][tiers][populate]=*',
  'populate[sections][on][sections.faq][populate][faqs][populate]=*',
  'populate[sections][on][sections.three-column-img-content][populate][items][populate]=*',
  'populate[sections][on][sections.expertise-content][populate][expertise_items][populate]=*',
  'populate[sections][on][sections.equal-grid][populate][grid_items][populate]=*',
  'populate[sections][on][sections.unsequenced-grid][populate][grid_items][populate]=*',
  'populate[sections][on][sections.cta][populate]=*',
  'populate[sections][on][sections.slider][populate][slides][populate]=*',
  'populate[sections][on][sections.image][populate]=*',
  'populate[sections][on][sections.contact][populate]=*',
  'populate[sections][on][sections.two-column-img-content][populate]=*',
  'populate[sections][on][sections.image-text][populate]=*',
  'populate[sections][on][sections.image-text-highlighted][populate]=*',
  'populate[sections][on][sections.two-column-image][populate]=*',
  'populate[sections][on][sections.text-highlighted][populate]=*',
  'populate[sections][on][sections.thank-you][populate]=*',
  'populate[sections][on][sections.quote][populate]=*',
  'populate[sections][on][sections.about][populate]=*'
].join('&');
