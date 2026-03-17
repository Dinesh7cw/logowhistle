import { fetchStrapi, UNIVERSAL_POPULATE } from '@/lib/strapi';
import SectionRenderer from '@/components/blog-sections';

export default async function Process() {
  let pageData: any = null;

  try {
    pageData = await fetchStrapi(`process-page?${UNIVERSAL_POPULATE}`);
  } catch (e) {
    console.error('Process page fetch failed', e);
  }

  if (!pageData) return null;

  const sections = pageData.sections || [];

  return (
    <div className="bg-white min-h-screen">
      <SectionRenderer sections={sections} />
    </div>
  );
}
