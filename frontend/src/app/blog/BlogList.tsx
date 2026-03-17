'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getStrapiMedia } from '@/lib/strapi';
import Image from 'next/image';

import Link from 'next/link';
import clsx from 'clsx';

interface BlogPost {
  title: string;
  slug: string;
  publishedDate: string;
  featuredImage?: {
    url: string;
  };
}

interface Pagination {
  page: number;
  pageSize: number;
  pageCount: number;
  total: number;
}

export default function BlogList({ posts, pagination }: { posts: BlogPost[]; pagination: Pagination | null }) {
  const [hoveredPost, setHoveredPost] = useState<BlogPost | null>(null);

  const formatDate = (dateString: string | null | undefined, fallbackDate?: string) => {
    const dateToUse = dateString || fallbackDate;
    if (!dateToUse) return "Date Pending";
    
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateToUse).toLocaleDateString('en-US', options);
  };

  const renderPagination = () => {
    if (!pagination || pagination.pageCount <= 1) return null;

    const { page, pageCount } = pagination;
    const pages = Array.from({ length: pageCount }, (_, i) => i + 1);

    return (
      <div className="flex items-center gap-2 mt-16 justify-center">
        {/* Previous Button */}
        {page > 1 && (
          <Link
            href={`/blog?page=${page - 1}`}
            className="w-10 h-10 flex items-center justify-center border border-[#E5E7EB] text-[#6B7280] hover:border-[#9CA3AF] transition-colors"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12.5 15L7.5 10L12.5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </Link>
        )}

        {/* Page Numbers */}
        {pages.map((p) => (
          <Link
            key={p}
            href={`/blog?page=${p}`}
            className={clsx(
              "w-10 h-10 flex items-center justify-center border transition-colors",
              p === page 
                ? "bg-[#6B7280] border-[#6B7280] text-white" 
                : "border-[#E5E7EB] text-[#6B7280] hover:border-[#6B7280]"
            )}
            style={{
              fontFamily: 'var(--font-work-sans), "Work Sans", sans-serif',
              fontSize: '16px',
            }}
          >
            {p}
          </Link>
        ))}

        {/* Next Button */}
        {page < pageCount && (
          <Link
            href={`/blog?page=${page + 1}`}
            className="w-10 h-10 flex items-center justify-center border border-[#E5E7EB] text-[#6B7280] hover:border-[#9CA3AF] transition-colors"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M7.5 5L12.5 10L7.5 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </Link>
        )}
      </div>
    );
  };

  return (
    <div className="relative max-w-[1400px] mx-auto">
      {/* Blog Entries */}
      <div className="">
        {posts.map((post) => (
          <div
            key={post.slug}
            className="group py-12 grid grid-cols-1 md:grid-cols-[60%_40%] items-center cursor-pointer transition-colors duration-300"
            onMouseEnter={() => setHoveredPost(post)}
            onMouseLeave={() => setHoveredPost(null)}
          >
            {/* Left Content (60%) - Border restricted here */}
            <div className="flex flex-col md:flex-row items-center border-b border-gray-100 pb-12 w-full h-full">
                  <div className="w-full md:w-[150px] shrink-0 mr-[20px]">
                    <span 
                      className="font-medium whitespace-nowrap"
                      style={{
                        fontSize: '10px',
                        letterSpacing: '2px',
                        textTransform: 'uppercase',
                      }}
                    >
                      {formatDate(post.publishedDate, (post as any).publishedAt)}
                    </span>
                  </div>
              <div className="flex-1">
                <Link href={`/blog/${post.slug}`}>
                  <h2 
                    className="font-normal transition-all duration-300 group-hover:text-[#E6602F] text-[var(--dark-color)] !font-sans"
                    style={{
                      fontSize: '26px',
                      lineHeight: '35px',
                      marginBottom: '0px',
                      fontWeight: '400',
                      fontFamily: 'var(--font-work-sans), "Work Sans", sans-serif'
                    }}
                  >
                    {post.title}
                  </h2>
                </Link>
              </div>
            </div>

            {/* Right Preview Image (40%) */}
            <div className="hidden md:flex justify-end pr-4 relative h-0">
              <AnimatePresence>
                {hoveredPost?.slug === post.slug && (
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ 
                      duration: 0.4,
                      ease: [0.23, 1, 0.32, 1] 
                    }}
                    className="absolute right-4 overflow-hidden w-[360px] aspect-[16/9] z-10"
                    style={{ top: '50%', translateY: '-50%' }}
                  >
                    <Link href={`/blog/${post.slug}`}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={getStrapiMedia(post.featuredImage)}
                        alt={post.title}
                        className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                      />
                    </Link>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {renderPagination()}
    </div>
  );
}
