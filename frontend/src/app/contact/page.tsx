import { fetchStrapi, UNIVERSAL_POPULATE } from '@/lib/strapi';
import { Mail, Phone, MapPin } from 'lucide-react';
import SectionRenderer from '@/components/blog-sections';

export default async function Contact() {
  let pageData: any = null;
  try {
    pageData = await fetchStrapi(`contact-page?${UNIVERSAL_POPULATE}`);
  } catch (e) {
    console.error('Failed to fetch contact-page:', e);
  }

  const sections = pageData?.sections || [];

  return (
    <div className="bg-white min-h-screen">
      <SectionRenderer sections={sections} />
      
      {/* If the dynamic zone is empty, we show nothing or a minimal container. 
          The user should add a 'sections.contact' component to the dynamic zone to see the form and info. */}
      {sections.length === 0 && (
        <div className="max-w-[1100px] mx-auto px-4 py-20 text-center text-gray-400 border border-dashed rounded-xl">
          Add components to the "Sections" dynamic zone in Strapi to build this page.
        </div>
      )}
    </div>
  );
}
