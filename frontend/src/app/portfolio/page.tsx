import Image from 'next/image';
import { fetchStrapi, getStrapiMedia, UNIVERSAL_POPULATE } from '@/lib/strapi';
import SectionRenderer from '@/components/blog-sections';

export default async function Portfolio() {
  const items = await fetchStrapi('portfolio-items?populate=*&sort=displayOrder:asc', { cache: 'no-store' }) ?? [];
  
  let pageData: any = null;
  try {
    // Adding timestamp or no-store to bypass potential aggressive caches for now
    pageData = await fetchStrapi(`portfolio-page?${UNIVERSAL_POPULATE}`, {
      cache: 'no-store'
    }, false, true);
  } catch (e) {
    console.error('Portfolio page fetch failed:', e);
  }

  const sections = pageData?.sections || [];

  return (
    <div className="pb-24">
      {/* Dynamic Sections (Hero, etc.) */}
      {sections.length > 0 && <SectionRenderer sections={sections} />}

      {/* Portfolio Items Grid — only render items that have a featuredImage from Strapi */}
      {items.filter((item: any) => getStrapiMedia(item.featuredImage)).length > 0 && (
        <div className="max-w-7xl mx-auto px-4 mt-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            {items
              .filter((item: any) => getStrapiMedia(item.featuredImage))
              .map((item: any) => (
                <div key={item.id} className="group">
                  <div className="aspect-square relative overflow-hidden rounded-3xl bg-gray-100 shadow-sm group-hover:shadow-2xl transition-all duration-500">
                    <Image
                      src={getStrapiMedia(item.featuredImage)!}
                      alt={item.title}
                      fill
                      className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-700"
                    />
                  </div>
                  <h3 className="mt-6 text-xl font-bold text-gray-900 text-center">{item.title}</h3>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}
