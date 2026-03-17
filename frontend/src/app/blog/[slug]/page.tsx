import { fetchStrapi, getStrapiMedia, UNIVERSAL_POPULATE } from '@/lib/strapi';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import SectionRenderer from '@/components/blog-sections';
import { Metadata } from 'next';

export async function generateStaticParams() {
  try {
    const posts = await fetchStrapi('blog-posts?fields[0]=slug&pagination[pageSize]=100');
    return posts.map((post: any) => ({
      slug: post.slug,
    }));
  } catch (error) {
    console.error('Error generating static params:', error);
    return [];
  }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const posts = await fetchStrapi(`blog-posts?filters[slug][$eq]=${slug}&populate[featuredImage]=true`);
  const post = posts?.[0];

  if (!post) return {};

  const imageUrl = getStrapiMedia(post.featuredImage) || '';

  return {
    title: post.title,
    description: post.excerpt || `Read more about ${post.title}`,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      images: imageUrl ? [{ url: imageUrl }] : [],
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt,
      images: imageUrl ? [imageUrl] : [],
    }
  };
}

export default async function BlogPost({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  
  // Fetch current post with sections populated using UNIVERSAL_POPULATE
  const posts = await fetchStrapi(`blog-posts?filters[slug][$eq]=${slug}&populate[featuredImage]=true&${UNIVERSAL_POPULATE}`);
  const post = posts?.[0];

  if (!post) {
    return notFound();
  }

  // Fetch related posts (latest 4 excluding current)
  const relatedPosts = await fetchStrapi(`blog-posts?filters[slug][$ne]=${slug}&sort=publishedDate:desc&pagination[limit]=4&populate=featuredImage`);

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  return (
    <div className="bg-[#f8f9fa] min-h-screen">
      {/* Hero Section */}
      <section className="pt-12 pb-16 px-4 md:px-8">
        <div className="max-w-[900px] mx-auto text-center">
          {/* Featured Image */}
          <div className="mb-12 overflow-hidden bg-white relative aspect-[16/9] max-h-[600px]">
            <Image
              src={getStrapiMedia(post.featuredImage) || ''}
              alt={post.title}
              fill
              priority
              className="object-cover"
            />
          </div>

          {/* Title - Using Work Sans as per user request for blog titles */}
          <h1 className="text-[36px] md:text-[52px] font-normal leading-[1.2] text-black mb-8 px-4" 
              style={{ fontFamily: "'Work Sans', sans-serif" }}>
            {post.title}
          </h1>

        </div>
      </section>

      {/* Main Content Container with Sidebar Layout */}
      <section className="pb-20 px-0 max-w-[900px] mx-auto">
        <div className="flex flex-col md:flex-row gap-0">
          {/* Sidebar Meta Info */}
          <aside className="w-full md:w-[220px] pt-4">
            <div className="sticky top-24 flex flex-col gap-10">
              <div className="flex flex-col gap-1">
                <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#999]">Author</span>
                <span className="text-[15px] text-[#444] font-medium">{post.author || 'SEO Admin'}</span>
              </div>
              
              <div className="flex flex-col gap-1">
                <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#999]">Category</span>
                <span className="text-[15px] text-orange-600 font-bold uppercase tracking-wider">
                  {post.category || 'Logo Design'}
                </span>
              </div>

              <div className="flex flex-col gap-1">
                <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#999]">Date</span>
                <span className="text-[15px] text-[#444] font-medium">{formatDate(post.publishedDate)}</span>
              </div>
            </div>
          </aside>

          {/* Main Blog Content Area */}
          <div className="flex-1 max-w-[900px]">
            {/* Dynamic Sections Renderer */}
            <SectionRenderer sections={post.sections} />
          </div>
        </div>

        {/* Related Posts Section - Full Width below the content/sidebar */}
        <div className="border-t border-gray-200 pt-16 mt-20">
          <div className="flex justify-between items-end mb-10">
            <h2 className="text-[32px] !font-normal text-black" 
                style={{ fontFamily: "'Work Sans', sans-serif", fontSize: "32px !important", fontWeight: "400 !important" }}>
              Related Posts
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-y-16 gap-x-10">
            {relatedPosts.map((related: any) => (
              <Link 
                key={related.id} 
                href={`/blog/${related.slug}`}
                className="group block text-left"
              >
                <div className="aspect-[16/9] overflow-hidden mb-5 bg-gray-100 relative">
                  <Image
                    src={getStrapiMedia(related.featuredImage) || ''}
                    alt={related.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="text-[10px] uppercase tracking-[0.2em] text-[#888] mb-2">
                  {formatDate(related.publishedDate)}
                </div>
                <h4 className="text-[18px] font-normal leading-[1.3] text-black group-hover:text-[#E6602F] transition-colors line-clamp-3"
                    style={{ fontFamily: "'Work Sans', sans-serif" }}>
                  {related.title}
                </h4>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
