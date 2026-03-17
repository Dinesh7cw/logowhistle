import { fetchStrapi, UNIVERSAL_POPULATE } from '@/lib/strapi';
import SectionRenderer from '@/components/blog-sections';

export default async function Home() {
  let homepage: any = null;

  try {
    homepage = await fetchStrapi(`homepage?${UNIVERSAL_POPULATE}`, {
      cache: 'no-store'
    });
  } catch (e) {
    console.error('homepage fetch failed', e);
  }

  return (
    <div className="flex flex-col bg-white text-black pb-0 font-sans">
      {/* ── DYNAMIC SECTIONS (Hero, About, Grid, CTA, etc.) ── */}
      {homepage?.sections && <SectionRenderer sections={homepage.sections} />}
    </div>
  );
}
