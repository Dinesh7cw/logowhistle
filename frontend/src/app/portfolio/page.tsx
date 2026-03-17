import { fetchStrapi, getStrapiMedia, UNIVERSAL_POPULATE } from '@/lib/strapi';
import SectionRenderer from '@/components/blog-sections';

export default async function Portfolio() {
  const items = await fetchStrapi('portfolio-items?populate=*&sort=displayOrder:asc');
  
  let pageData: any = null;
  try {
    // Adding timestamp to bypass potential aggressive caches for now
    pageData = await fetchStrapi(`portfolio-page?${UNIVERSAL_POPULATE}`, {
      cache: 'no-store'
    });
    console.log('Portfolio Page Data Fetched:', !!pageData);
  } catch (e) {
    console.error('Portfolio page fetch failed:', e);
  }

  const sections = pageData?.sections || [];

  return (
    <div className="pb-24">
      {/* Dynamic Sections (Hero, etc.) */}
      {sections.length > 0 ? (
        <SectionRenderer sections={sections} />
      ) : (
        <header className="bg-gray-50 py-24 px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 mb-6">Our Portfolio</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            We take pride in our work. Explore the diverse range of logos we've created for brands across various industries.
          </p>
        </header>
      )}

      {/* Portfolio Items Grid */}
      <div className="max-w-7xl mx-auto px-4 mt-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          {items?.map((item: any) => (
            <div key={item.id} className="group">
              <div className="aspect-square relative overflow-hidden rounded-3xl bg-gray-100 shadow-sm group-hover:shadow-2xl transition-all duration-500">
                <img
                  src={getStrapiMedia(item.featuredImage) || 'https://via.placeholder.com/600'}
                  alt={item.title}
                  className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-700"
                />
              </div>
              <h3 className="mt-6 text-xl font-bold text-gray-900 text-center">{item.title}</h3>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
