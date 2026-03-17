'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { getStrapiMedia } from '@/lib/strapi';

const navigation = [
  { name: 'Process', href: '/process' },
  { name: 'Pricing', href: '/pricing' },
  { name: 'Portfolio', href: '/portfolio' },
  { name: 'Faq', href: '/faqs' },
  { name: 'Blog', href: '/blog' },
];

export default function NavbarClient({ globalSettings }: { globalSettings: any }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed w-full z-50 bg-white transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-[90px]">
          
          {/* Left: Logo */}
          <div className="flex-1 flex justify-start items-center">
            <Link href="/" className="flex-shrink-0 flex items-center">
              {globalSettings?.logo && (
                 // eslint-disable-next-line @next/next/no-img-element
                 <img 
                   src={getStrapiMedia(globalSettings.logo)} 
                   alt={globalSettings.siteName || 'LogoWhistle'} 
                   className="h-[47px] w-auto"
                 />
              )}
            </Link>
          </div>
          
          {/* Center: Desktop Menu */}
          <div className="hidden md:flex flex-none items-center">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-[16px] font-normal text-black hover:text-[#f1592a] transition-colors py-[20px] px-[15px]"
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Right: Contact Us */}
          <div className="hidden md:flex flex-1 justify-end items-center">
            <Link
              href="/contact"
              className="relative text-[16px] font-normal text-black hover:text-[#f1592a] transition-colors py-[20px] px-[15px] before:content-[''] before:absolute before:bottom-[15px] before:left-[15px] before:w-[90px] before:border-b-2 before:border-[#e6602f] before:transition-all hover:before:w-[calc(100%-30px)]"
            >
              Contact Us
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-[#f1592a] focus:outline-none"
            >
              {isOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white shadow-lg absolute w-full left-0 top-[90px]">
          <div className="px-4 py-4 flex flex-col space-y-4 shadow-inner">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className="block text-sm font-semibold text-gray-800 hover:text-[#f1592a] uppercase tracking-wide"
              >
                {item.name}
              </Link>
            ))}
            <Link
              href="/contact"
              onClick={() => setIsOpen(false)}
              className="block text-sm font-semibold text-[#f1592a] uppercase tracking-wide"
            >
              Contact Us
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}

