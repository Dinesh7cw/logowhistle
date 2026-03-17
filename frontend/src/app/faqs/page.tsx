import { fetchStrapi, UNIVERSAL_POPULATE } from '@/lib/strapi';
import SectionRenderer from '@/components/blog-sections';

export default async function FAQs() {
  let pageData: any = null;

  try {
    pageData = await fetchStrapi(`faq-page?${UNIVERSAL_POPULATE}`);
  } catch (e) {
    console.error('Failed to fetch faq-page:', e);
  }

  const sections = pageData?.sections ?? [];

  return (
    <div className="bg-white min-h-screen">
      <SectionRenderer sections={sections} />
    </div>
  );
}
