import { fetchStrapi, UNIVERSAL_POPULATE } from '@/lib/strapi';
import SectionRenderer from '@/components/blog-sections';

export default async function PricingPage() {
  let pricingData: any = null;

  try {
    pricingData = await fetchStrapi(`pricing-page?${UNIVERSAL_POPULATE}`);
  } catch (e) {
    console.error('Failed to fetch pricing page data', e);
  }

  const sections = pricingData?.sections || [];

  return (
    <div className="flex flex-col bg-white text-black font-sans">
      <SectionRenderer sections={sections} />
    </div>
  );
}
