import { fetchStrapi, UNIVERSAL_POPULATE } from '@/lib/strapi';
import BlogList from './BlogList';
import SectionRenderer from '@/components/blog-sections';

export default async function BlogPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const { page } = await searchParams;
  const currentPage = parseInt(page || '1');
  const pageSize = 10;

  let postsData: any = null;
  let pageData: any = null;

  try {
    postsData = await fetchStrapi(
      `blog-posts?populate=featuredImage&sort[0]=publishedDate:desc&sort[1]=publishedAt:desc&pagination[page]=${currentPage}&pagination[pageSize]=${pageSize}`,
      {},
      true
    );
    pageData = await fetchStrapi(`blog-page?${UNIVERSAL_POPULATE}`);
  } catch (e) {
    console.error('Failed to fetch blog page data:', e);
  }

  const posts = postsData?.data || [];
  const pagination = postsData?.meta?.pagination || null;
  const sections = pageData?.sections || [];

  return (
    <div className="bg-white">
      <SectionRenderer sections={sections} />

      {/* Blog List Section - Automatically follows dynamic sections */}
      {posts.length > 0 && (
        <section className="py-20 px-4 md:px-8">
          <div className="max-w-[1240px] mx-auto">
            <BlogList posts={posts} pagination={pagination} />
          </div>
        </section>
      )}
    </div>
  );
}
