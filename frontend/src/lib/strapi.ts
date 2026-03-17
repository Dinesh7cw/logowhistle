const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:7000';

export async function fetchStrapi(endpoint: string, options: any = {}, returnMeta: boolean = false, allow404: boolean = false) {
  const res = await fetch(`${STRAPI_URL}/api/${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    next: { revalidate: 3600 }, // Enable revalidation for production
  });

  if (!res.ok) {
    if (res.status === 404 && allow404) {
      return null;
    }
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
// Helper to build granular populate strings for dynamic zones
// Usage: fetchStrapi(`pages?${getSectionsPopulate(['hero', 'content'])}`)
export function getSectionsPopulate(components: string[] = []) {
  if (components.length === 0) return "populate[sections][populate]=*";
  
  return components
    .map(comp => {
      // Define specific deep population requirements for components with nested media
      const base = `populate[sections][on][sections.${comp}][populate]`;
      
      switch(comp) {
        case 'unsequenced-grid':
        case 'unequal-grid':
        case 'equal-grid':
          return `${base}[grid_items][populate]=*`;
        case 'slider':
          return `${base}[slides][populate]=*`;
        case 'pricing-tiers':
          return `${base}[tiers][populate]=*`;
        case 'three-column-img-content':
          return `${base}[items][populate]=*`;
        case 'expertise-content':
          return `${base}[expertise_items][populate]=*`;
        default:
          return `${base}=*`;
      }
    })
    .join('&');
}

// Minimal universal population for common sections
export const UNIVERSAL_POPULATE = getSectionsPopulate([
  'hero', 'hero-intro', 'content', 'slider', 'article',
  'blog-quote', 'also-read', 'cta', 'pricing-tiers', 'faq',
  'pricing', 'gallery', 'image-repeater', 'image', 'contact',
  'three-column-img-content', 'expertise-content',
  'equal-grid', 'unsequenced-grid', 'quote',
  'two-column-img-content', 'image-text',
  'image-text-highlighted', 'two-column-image',
  'text-highlighted', 'thank-you', 'filled-box', 'about'
]);
