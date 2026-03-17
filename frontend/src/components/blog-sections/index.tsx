import { getStrapiMedia, fetchStrapi } from '@/lib/strapi';
import { parseMarkdown } from "@/lib/markdown";
import Link from 'next/link';
import Image from 'next/image';
import DOMPurify from 'isomorphic-dompurify';
import ContactForm from '../ContactForm';
import { SliderSectionClient } from './SliderSectionClient';

// Hero Section
export const DynamicHero = ({ data, noMargin }: { data: any, noMargin?: boolean }) => (
  <section className={`px-4 pt-[35px] ${noMargin ? 'mb-0' : 'mb-[55px]'} max-w-[1200px] mx-auto w-full text-center`}>
    <h1 className="text-[40px] md:text-[60px] font-serif leading-[1.2] md:leading-[1.1] tracking-tight md:tracking-[-3px] mb-[10px] text-black font-normal">
      {data.headline?.replace(data.boldWord || '', '').trim()}{' '}
      <span className="text-[#f1592a] font-serif block sm:inline-block font-normal">{data.boldWord}</span>
    </h1>
    
    <h3 className="text-[20px] md:text-[30px] font-serif font-normal text-black md:leading-[1.2] max-w-3xl mx-auto mb-[10px]">
      {data.subheadline}
    </h3>

    {data.dividerImage && (
      <div className="w-full flex justify-center pb-0 mt-[20px]">
        <Image 
          src={getStrapiMedia(data.dividerImage)} 
          alt="Divider" 
          width={200}
          height={100}
          className="h-[100px] w-auto object-contain"
        />
      </div>
    )}

    {/* Hero Description (Two Columns) */}
    {(data.leftDescription || data.rightDescription) && (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 text-black leading-[28.8px] font-sans text-left font-normal max-w-[1140px] mx-auto mt-[50px]">
        <div className="space-y-4">
          {data.leftDescription?.split('\n').filter((p: string) => p.trim() !== '').map((para: string, i: number) => (
            <p key={i}>{para}</p>
          ))}
        </div>
        <div className="space-y-4">
          {data.rightDescription?.split('\n').filter((p: string) => p.trim() !== '').map((para: string, i: number) => (
            <p key={i}>{para}</p>
          ))}
        </div>
      </div>
    )}
  </section>
);

// Hero Intro Section
export const HeroIntro = ({ data, noMargin }: { data: any, noMargin?: boolean }) => (
  <section className={`relative h-[600px] flex items-center justify-center overflow-hidden ${noMargin ? 'mb-0' : 'mb-20'} rounded-xl`}>
    {data.background_image && (
      <Image
        src={getStrapiMedia(data.background_image)}
        fill
        className="absolute inset-0 w-full h-full object-cover"
        alt={data.title}
      />
    )}
    <div className="absolute inset-0 bg-black/40" />
    <div className="relative z-10 text-center text-white px-4 max-w-4xl">
      <h4 className="text-orange-500 font-bold uppercase tracking-widest mb-4">
        {data.subtitle}
      </h4>
      <h1 className="text-5xl md:text-7xl font-bold mb-6" style={{ fontFamily: "'Work Sans', sans-serif" }}>
        {data.title}
      </h1>
      <div className="text-lg mb-8 opacity-90" dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(parseMarkdown(data.description)) }} />
      {data.button_text && (
        <a href={data.button_link} className="bg-orange-600 hover:bg-orange-700 text-white px-8 py-4 rounded-full font-bold transition-all">
          {data.button_text}
        </a>
      )}
    </div>
  </section>
);

// Gallery Section
// Image Grid Component (Standard 3-column gallery)
export const ImageGrid = ({ data }: { data: any }) => (
  <section className="mb-24 px-4">
    <div className="max-w-[1240px] mx-auto">
      {data.section_title && (
        <h2 className="text-[32px] !font-normal !font-sans capitalize mb-12 text-center text-black" style={{ fontSize: "32px !important", fontWeight: "400 !important" }}>
          {data.section_title}
        </h2>
      )}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {(data.images?.data || data.images)?.map((img: any, idx: number) => (
          <div key={idx} className="aspect-square overflow-hidden rounded-lg">
            <Image
              src={getStrapiMedia(img)}
              alt={`Gallery ${idx}`}
              width={400}
              height={400}
              className="w-full h-full object-cover"
            />
          </div>
        ))}
      </div>
    </div>
  </section>
);

// Image Repeater Component (Flexible Row for Icons/Features)
export const ImageRepeater = ({ data }: { data: any }) => (
  <section className="mb-0 px-4 pt-4 pb-6">
    <div className="max-w-[900px] mx-auto">
      {data.section_title && (
        <h2 className="text-[32px] !font-normal !font-sans mb-10 text-left text-black capitalize tracking-wide" style={{ fontSize: "32px !important", fontWeight: "400 !important" }}>
          {data.section_title}
        </h2>
      )}
      <div className="flex flex-wrap items-center justify-between gap-y-10">
        {(data.images?.data || data.images)?.map((img: any, idx: number) => (
          <div key={idx} className="flex items-center justify-center">
            <Image
              src={getStrapiMedia(img)}
              alt={`Feature ${idx}`}
              width={150}
              height={80}
              className="w-auto object-contain"
            />
          </div>
        ))}
      </div>
    </div>
  </section>
);

// Content Section
export const Content = ({ data, noMargin }: { data: any, noMargin?: boolean }) => (
  <section className={`${noMargin ? 'mb-0' : 'mb-20'} flex flex-col md:flex-row gap-10 items-center`}>
    <div className={`w-full ${data.image ? 'md:w-1/2' : 'w-full'}`}>
      {data.title && (
        <h2 className="text-[32px] !font-normal mb-6" style={{ fontFamily: "'Work Sans', sans-serif", fontSize: "32px !important", fontWeight: "400 !important" }}>
          {data.title}
        </h2>
      )}
      <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed" 
           dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(parseMarkdown(data.content)) }} />
    </div>
    {data.image && (
      <div className="w-full md:w-1/2">
        <Image src={getStrapiMedia(data.image)} alt={data.title} width={600} height={400} className="w-full h-auto rounded-lg shadow-md" />
      </div>
    )}
  </section>
);

// Pricing Section (Legacy/Blog)
export const Pricing = ({ data }: { data: any }) => (
  <section className="mb-20">
    {data.section_title && (
      <h2 className="text-3xl font-bold mb-10 text-center" style={{ fontFamily: "'Work Sans', sans-serif" }}>
        {data.section_title}
      </h2>
    )}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {data.pricing_items?.map((item: any, idx: number) => (
        <div key={idx} className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 hover:scale-105 transition-transform">
          <h3 className="text-xl font-bold mb-2">{item.plan_title}</h3>
          <div className="text-4xl font-bold text-orange-600 mb-4">{item.price}</div>
          <div className="text-gray-600 mb-6" dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(parseMarkdown(item.description)) }} />
          <ul className="mb-8 space-y-3">
            {item.features?.map((f: any, i: number) => (
              <li key={i} className="flex items-center gap-2 text-sm text-gray-700">
                <span className="text-green-500">✓</span> {f.value || f}
              </li>
            ))}
          </ul>
          {item.button_text && (
            <a href={item.button_link} className="block text-center border-2 border-orange-600 text-orange-600 font-bold py-3 rounded-full hover:bg-orange-600 hover:text-white transition-colors">
              {item.button_text}
            </a>
          )}
        </div>
      ))}
    </div>
  </section>
);

// Pricing Tiers Section (Premium Style)
export const PricingTiers = ({ data }: { data: any }) => (
  <section className="bg-white pt-0 pb-0 px-4 overflow-hidden">
    {data.section_title && (
      <h2 className="text-[40px] md:text-[60px] !font-sans capitalize font-normal text-center mb-16">
        {data.section_title}
      </h2>
    )}
    <div className="max-w-[1240px] mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 justify-items-center">
      {data.tiers?.map((tier: any, index: number) => (
        <div 
          key={index} 
          className="flex flex-col items-center bg-transparent p-[25px_30px] h-full w-full"
        >
          {/* Package Icon */}
          <div className="mb-4 min-h-[120px] flex items-center justify-center">
            {tier.packageIcon ? (
              <Image 
                src={getStrapiMedia(tier.packageIcon)} 
                alt={tier.packageName} 
                width={120}
                height={120}
                className="max-w-full h-auto object-contain"
              />
            ) : (
              <div className="w-20 h-20 rounded-full bg-gray-50 flex items-center justify-center">
                <span className="text-gray-300 text-xs italic">Icon missing</span>
              </div>
            )}
          </div>

          {/* Package Name */}
          <h4 className="text-[#E6602F] text-[22px] font-sans font-semibold mb-0 uppercase text-center w-full max-w-[280px] mx-auto leading-tight" style={{ fontFamily: 'var(--font-work-sans), "Work Sans", sans-serif' }}>
            {tier.packageName}
          </h4>

          {/* Package Tagline */}
          <div className="w-fit border-b border-gray-100 pb-[12px] mb-0 mx-auto">
            <p className="text-center leading-[24px] text-[#666] mt-1 max-w-[320px] text-[16px] !mb-0">
              {tier.packageTagline}
            </p>
          </div>

          {/* Package Features */}
          <div className="w-full flex flex-col items-center flex-1 pt-[12px]">
            <ul className="space-y-[5px] text-center mb-12 list-none p-0">
              {tier.packageFeatures?.split('\n').filter((f: string) => f.trim() !== '').map((feature: string, i: number) => (
                <li key={i} className="text-[14px] text-[#404040] leading-[1.8]">
                  {feature.trim()}
                </li>
              ))}
            </ul>

            {/* Price and CTA */}
            <div className="mt-auto flex flex-col items-center w-full">
              <h2 className="text-[#E6602F] text-[32px] font-sans font-medium leading-[1.15] mb-8 flex items-start justify-center" style={{ fontFamily: 'var(--font-work-sans), "Work Sans", sans-serif' }}>
                <sup className="text-[20px] font-normal relative top-[2.5px] pr-0.5" style={{ fontFamily: 'var(--font-work-sans), "Work Sans", sans-serif' }}>$</sup>
                <span className="leading-none" style={{ fontFamily: 'var(--font-work-sans), "Work Sans", sans-serif' }}>{tier.packagePrice?.replace('$', '')}</span>
              </h2>

              <a 
                href={tier.buttonUrl || "/contact"}
                className="inline-block px-10 py-5 border-2 border-black text-[16px] font-medium text-black uppercase hover:bg-black hover:text-white transition-all duration-200"
              >
                {tier.buttonLabel || "Get Now"}
              </a>
            </div>
          </div>
        </div>
      ))}
    </div>
  </section>
);

// Column Item
const ColumnItem = ({ item }: { item: any }) => (
  <div className="flex flex-col items-center text-center group">
    {item.image && (
      <div className="w-20 h-20 mb-6 group-hover:scale-110 transition-transform">
        <Image src={getStrapiMedia(item.image)} alt={item.title} width={80} height={80} className="w-full h-full object-contain" />
      </div>
    )}
    <h3 className="text-xl font-bold mb-3">{item.title}</h3>
    <div className="text-gray-600 text-sm leading-relaxed mb-4" dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(parseMarkdown(item.description)) }} />
    {item.link && (
      <a href={item.link} className="text-orange-600 font-semibold text-xs uppercase tracking-widest hover:underline">
        Learn More →
      </a>
    )}
  </div>
);

// Three Column Section (Dynamic Grid)
export const ThreeColumn = ({ data }: { data: any }) => {
  const items = data.items || data.grid_items || [];
  const columnCount = items.length === 4 ? 4 : 3; // Support 4 columns for features
  
  return (
    <section className="mb-24 px-4">
      <div className="max-w-[1100px] mx-auto">
        {data.section_title && (
          <h2 className="text-[32px] !font-normal !font-sans capitalize mb-12 text-center text-black" style={{ fontSize: "32px !important", fontWeight: "400 !important" }}>
            {data.section_title}
          </h2>
        )}
        <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-${columnCount} gap-12`}>
          {items.map((item: any, idx: number) => (
            <ColumnItem key={idx} item={item} />
          ))}
        </div>
      </div>
    </section>
  );
};

// Expertise Row Section (Logo Design Help style)
const ExpertiseRow = ({ item }: { item: any }) => (
  <div className="flex flex-col md:flex-row gap-10 items-start mb-14 last:mb-0">
    <div className="w-full md:w-[35%] flex items-center justify-center pt-2">
      {item.image && (
        <Image src={getStrapiMedia(item.image)} alt="Expertise Icon" width={300} height={200} className="max-w-full h-auto object-contain" />
      )}
    </div>
    <div className="w-full md:w-[65%] text-[15px] leading-[1.8] text-[#444]">
      <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(parseMarkdown(item.description || '')) }} />
    </div>
  </div>
);

export const ExpertiseList = ({ data }: { data: any }) => (
  <section className="mb-24 px-4 py-8">
    <div className="max-w-[900px] mx-auto">
      {data.section_title && (
        <h2 className="text-[32px] !font-normal !font-sans mb-14 text-left text-black capitalize tracking-wide" style={{ fontSize: "32px !important", fontWeight: "400 !important" }}>
          {data.section_title}
        </h2>
      )}
      <div className="space-y-4">
        {data.expertise_items?.map((item: any, idx: number) => (
          <ExpertiseRow key={idx} item={item} />
        ))}
      </div>
    </div>
  </section>
);

// Slider Section Wrapper
export const SliderSection = ({ data }: { data: any }) => (
  <SliderSectionClient data={data} />
);

// Image Section
export const ImageSection = ({ data, noMargin }: { data: any, noMargin?: boolean }) => (
  <section className={`${noMargin ? 'mb-0' : 'mb-24'} px-4`}>
    <div className="max-w-[1240px] mx-auto">
      {data.section_title && (
        <h2 className="text-[32px] !font-normal !font-sans capitalize mb-8 text-center text-black" style={{ fontSize: "32px !important", fontWeight: "400 !important" }}>
          {data.section_title}
        </h2>
      )}
      <div className="w-full">
        <Image 
          src={getStrapiMedia(data.image)} 
          alt={data.section_title || 'Section Image'} 
          width={1240}
          height={800}
          className="w-full h-auto" 
        />
      </div>
      {data.linkText && (
        <div className="mt-4 text-center">
          <a 
            href={data.linkUrl || '#'} 
            target={data.openInNewTab ? "_blank" : "_self"}
            rel={data.openInNewTab ? "noopener noreferrer" : ""}
            className="text-[16px] text-orange-600 hover:underline font-medium"
          >
            {data.linkText}
          </a>
        </div>
      )}
    </div>
  </section>
);

// Contact Section (Two-Column Layout: Details + Form)
export const ContactSection = ({ data }: { data: any }) => (
  <section className="mb-32 px-4 pt-16">
    <div className="max-w-[1200px] mx-auto">
      <div className="flex flex-col md:flex-row gap-x-28 gap-y-20">
        {/* Left: Contact Info */}
        <div className="w-full md:w-1/2 space-y-12">
          <div className="space-y-8">
            <h2 
              className="font-bold text-black mb-8"
              style={{ 
                fontFamily: "'Work Sans', sans-serif !important",
                fontSize: "16px",
                lineHeight: "1.8 !important"
              }}
            >
              Contact Us
            </h2>
            
            {data.address && (
              <div className="flex gap-4 items-start">
                <div className="shrink-0 mt-1.5">
                  <svg className="w-5 h-5 text-black" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                  </svg>
                </div>
                <p className="text-[17px] text-[#222] opacity-80 leading-[1.6] font-sans font-normal">
                  {data.address}
                </p>
              </div>
            )}

            {data.phone && (
              <div className="flex gap-4 items-start">
                <div className="shrink-0 mt-1.5">
                  <svg className="w-5 h-5 text-black" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
                  </svg>
                </div>
                <p className="text-[17px] text-[#222] opacity-80 leading-[1.6] font-sans font-normal">
                  {data.phone}
                </p>
              </div>
            )}

            {data.email && (
              <div className="flex gap-4 items-start">
                <div className="shrink-0 mt-1.5">
                  <svg className="w-5 h-5 text-black" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                  </svg>
                </div>
                <a href={`mailto:${data.email}`} className="text-[17px] text-[#222] opacity-80 leading-[1.6] font-sans font-normal hover:text-black transition-colors">
                  {data.email}
                </a>
              </div>
            )}
          </div>
        </div>

        {/* Right: Contact Form (Client Component) */}
        <div className="w-full md:w-1/2">
          <ContactForm description={data.form_description} />
        </div>
      </div>
    </div>
  </section>
);

// Two Column Section
export const TwoColumn = ({ data }: { data: any }) => (
  <section className={`mb-20 flex flex-col ${data.image_position === 'right' ? 'md:flex-row-reverse' : 'md:flex-row'} gap-12 items-center`}>
    <div className="w-full md:w-1/2">
      <Image src={getStrapiMedia(data.image || data.image_left)} alt={data.title} width={600} height={400} className="w-auto h-auto" />
    </div>
    <div className="w-full md:w-1/2">
      {data.title && <h2 className="text-4xl font-bold mb-6">{data.title}</h2>}
      {data.highlighted_text && <div className="text-orange-600 font-bold text-xl mb-4">{data.highlighted_text}</div>}
      <div className="text-gray-600 text-lg mb-8 leading-relaxed" dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(parseMarkdown(data.description)) }} />
      {data.button_text && (
        <a href={data.button_link} className="inline-block bg-orange-600 text-white px-8 py-4 rounded-full font-bold hover:bg-black transition-colors">
          {data.button_text}
        </a>
      )}
    </div>
  </section>
);

// Two Column Image (Only)
export const TwoColumnImage = ({ data }: { data: any }) => (
  <section className="mb-20">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-4">
      <Image src={getStrapiMedia(data.image_left)} width={600} height={400} className="w-auto h-auto" alt="Left" />
      <Image src={getStrapiMedia(data.image_right)} width={600} height={400} className="w-auto h-auto" alt="Right" />
    </div>
    {data.caption && <p className="text-center text-gray-500 italic">{data.caption}</p>}
  </section>
);

// Text Highlighted Section
export const TextHighlighted = ({ data }: { data: any }) => (
  <section className="mb-20 text-center max-w-4xl mx-auto px-4">
    {data.title && <h3 className="text-orange-600 font-bold uppercase tracking-widest mb-4">{data.title}</h3>}
    <h2 className="text-4xl md:text-5xl font-bold mb-8 leading-tight">{data.highlighted_text}</h2>
    <div className="text-xl text-gray-600 leading-relaxed" dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(parseMarkdown(data.description)) }} />
  </section>
);

// Thank You Section
export const ThankYou = ({ data }: { data: any }) => (
  <section className="mb-20 text-center py-20 bg-orange-50 rounded-[40px]">
    <h2 className="text-6xl font-bold mb-6 text-orange-600" style={{ fontFamily: "'Work Sans', sans-serif" }}>
      {data.title}
    </h2>
    <div className="text-xl text-gray-700 mb-10" dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(parseMarkdown(data.description)) }} />
    {data.button_text && (
      <a href={data.button_link} className="bg-black text-white px-10 py-5 rounded-full font-bold hover:bg-orange-600 transition-all text-lg">
        {data.button_text}
      </a>
    )}
  </section>
);

// Dynamic CTA Section
export const DynamicCTA = ({ data }: { data: any }) => {
  if (!data.title && !data.description) return null;

  return (
    <section className="w-full bg-white pt-0 pb-4 px-4 text-center">
      <div className="max-w-[760px] mx-auto">
        <h2 className="text-[40px] md:text-[65px] leading-[1.1] md:leading-[71.5px] font-medium font-serif text-[#000] text-center mb-4">
          {data.title && (
            <>
              <strong className="text-[#e6602f] font-medium">{data.title.split(' ').slice(0, 2).join(' ')}</strong>
              <br className="hidden md:block" />
              {data.title.split(' ').slice(2).join(' ')}
            </>
          )}
        </h2>

        {data.description && (
          <p className="text-[16px] leading-[28.8px] text-[#000] text-center mb-[15px]">
            {data.description}
          </p>
        )}

        {data.buttonLabel && (
          <Link
            href={data.buttonUrl || "/contact"}
            className="inline-block mt-[15px] px-8 py-4 border-2 border-black text-[16px] font-medium text-black hover:bg-[#e6602f] hover:text-white hover:border-[#e6602f] transition-colors rounded-none"
          >
            {data.buttonLabel}
          </Link>
        )}
      </div>
    </section>
  );
};

// Unsequenced Grid Section (Complex Portfolio Layout)
export const UnsequencedGrid = ({ data }: { data: any }) => (
  <section className="w-full mb-20 overflow-hidden">
    <div className="grid grid-cols-1 md:grid-cols-12 w-full gap-0">
      {data.grid_items?.map((item: any, index: number) => {
        let gridClass = "md:col-span-4 h-[250px] md:h-[500px]";
        const cycleIndex = index % 13;

        if (cycleIndex === 0) {
          gridClass = "md:col-span-8 h-[250px] md:h-[500px]";
        } else if (cycleIndex === 5) {
          gridClass = "md:col-span-8 md:row-span-2 h-[500px] md:h-[1000px]";
        } else if (cycleIndex === 11) {
          gridClass = "md:col-span-8 h-[250px] md:h-[500px]";
        }

        return (
          <div key={index} className={`relative w-full overflow-hidden bg-[#1c2434] group ${gridClass}`}>
            <a href={item.link || '#'} className="block w-full h-full relative">
              {item.image && (
                  <Image
                    src={getStrapiMedia(item.image)}
                    alt={item.title || 'Grid Item'}
                    fill
                    className="object-cover w-full h-full"
                  />
              )}
              {/* Orange Overlay with Title */}
              <div className="absolute inset-0 bg-[#E6602F] opacity-0 group-hover:opacity-100 transition-opacity duration-700 flex items-center justify-center p-8 text-center">
                <h3 className="text-white font-bold transition-all duration-700 font-serif" style={{ fontSize: '26px' }}>
                  {item.title}
                </h3>
              </div>
            </a>
          </div>
        );
      })}
    </div>
  </section>
);

// Quote Section
export const Quote = ({ data }: { data: any }) => (
  <section className="mb-0 p-[30px] bg-[#e6602f17] border-l-[10px] border-[#e6602f] rounded-[5px] italic">
    <div className="text-[16px] text-black leading-[1.6] font-normal prose prose-orange max-w-none" 
         style={{ fontFamily: "'Work Sans', sans-serif" }}
         dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(parseMarkdown(data.quote_text)) }} />
    {(data.author || data.author_title) && (
      <div className="not-italic flex flex-col mt-4">
        <span className="font-bold text-black text-[16px]">{data.author}</span>
        {data.author_title && <span className="text-gray-500 text-sm">{data.author_title}</span>}
      </div>
    )}
  </section>
);

// FAQ Section
export const DynamicFAQ = async ({ data }: { data: any }) => {
  let faqs = data.faqs ?? [];
  
  if (data.showAll) {
    try {
      // Fetch all published FAQs sorted by order
      faqs = await fetchStrapi('faq-items?sort=displayOrder:asc&pagination[pageSize]=100') || [];
    } catch (e) {
      console.error('Failed to fetch all FAQs in DynamicFAQ:', e);
    }
  }

  const mid = Math.ceil(faqs.length / 2);
  const leftFaqs = faqs.slice(0, mid);
  const rightFaqs = faqs.slice(mid);

  return (
    <section className="pt-[30px] pb-[60px] px-4 w-full">
      <div className="max-w-[1100px] mx-auto">
        {data.title && (
          <h2 className="text-[32px] !font-normal !font-sans capitalize text-center mb-12" style={{ fontSize: "32px !important", fontWeight: "400 !important" }}>{data.title}</h2>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-0">
          <div>
            {leftFaqs.map((faq: any) => (
              <div key={faq.id} className="mb-8">
                <h3 className="text-[22px] font-bold text-black mb-3 leading-[1.4]">
                  {faq.question}
                </h3>
                <div
                  className="text-[15px] leading-[1.7] text-[#444] font-normal [&_p]:mb-3 [&_a]:text-[#e47216] [&_a:hover]:underline"
                  dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(parseMarkdown(faq.answer)) }}
                />
              </div>
            ))}
          </div>
          <div>
            {rightFaqs.map((faq: any) => (
              <div key={faq.id} className="mb-8">
                <h3 className="text-[22px] font-bold text-black mb-3 leading-[1.4]">
                  {faq.question}
                </h3>
                <div
                  className="leading-[1.7] text-[#444] font-normal [&_a]:text-[#e47216] [&_a:hover]:underline"
                  dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(parseMarkdown(faq.answer)) }}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

import { BlocksRenderer } from '@strapi/blocks-react-renderer';

// Blog Quote Section
export const BlogQuote = ({ data }: { data: any }) => (
  <section className="max-w-[900px] mx-auto px-4 my-12">
    {data.section_title && (
      <h2 className="text-[32px] !font-normal !font-sans mb-10 text-left text-black capitalize tracking-wide" style={{ fontSize: "32px !important", fontWeight: "400 !important" }}>
        {data.section_title}
      </h2>
    )}
    <div className="flex gap-10 items-center">
      <div className="shrink-0 min-w-[160px]">
        {data.icon ? (
          <Image 
            src={getStrapiMedia(data.icon)} 
            alt="Quote Icon" 
            width={160}
            height={140}
            className="w-[160px] h-[140px] object-contain"
          />
        ) : (
          <svg width="160" height="140" viewBox="0 0 60 48" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M14.4 48C10 48 6.4 46.4 3.6 43.2C0.8 40 -0.6 35.8 0.2 30.6L2.4 16.2L4.8 0H19.2L16.8 16.2H24V32.4H13.2L14.4 48ZM48 48C43.6 48 40 46.4 37.2 43.2C34.4 40 33 35.8 33.8 30.6L36 16.2L38.4 0H52.8L50.4 16.2H57.6V32.4H46.8L48 48Z" fill="#999"/>
          </svg>
        )}
      </div>
      <div 
        className="text-[24px] leading-[40px] text-[#939393] font-normal relative [&_p]:!text-[24px] [&_p]:!leading-[40px] [&_p]:!text-[#939393]"
        style={{ fontFamily: "'Work Sans', sans-serif" }}
        dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(parseMarkdown(data.text || '')) }}
      />
    </div>
  </section>
);

// Filled Box Section
export const FilledBox = ({ data }: { data: any }) => (
  <section className="max-w-[900px] mx-auto px-4 mt-0 mb-12">
    {data.section_title && (
      <h2 className="text-[32px] !font-normal !font-sans mb-10 text-left text-black capitalize tracking-wide" style={{ fontSize: "32px !important", fontWeight: "400 !important" }}>
        {data.section_title}
      </h2>
    )}
    <div 
      className="py-10"
      style={{ 
        background: 'repeating-linear-gradient(-45deg, #e6602f14, #e6602f26 5px, #ffffff 5px, #ffffff 25px)',
        fontFamily: "'Work Sans', sans-serif"
      }}
    >
      <div 
        className="text-left px-0 [&_p]:!mb-0 [&_p]:!text-[43px] [&_p]:!font-[300] [&_p]:!leading-[1.25] [&_p]:!text-[#e6602f] [&_p]:!text-left"
        dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(parseMarkdown(data.text || '')) }}
      />
    </div>
  </section>
);

// Article Section (Strapi 5 Blocks Editor)
export const ArticleSection = ({ data, noMargin }: { data: any, noMargin?: boolean }) => {
  if (!data?.content) return null;

  return (
    <section className={`w-full ${noMargin ? 'mb-0' : 'mb-0'} px-4 py-8`}>
      <div className="max-w-[900px] mx-auto text-left">
        {data.section_title && (
          <h2 className="text-[32px] !font-normal !font-sans mb-10 text-left text-black capitalize tracking-wide" style={{ fontSize: "32px !important", fontWeight: "400 !important" }}>
            {data.section_title}
          </h2>
        )}
        <article 
          className="prose prose-orange max-w-none 
            prose-headings:!font-normal prose-headings:text-black 
            prose-h1:text-[36px] md:text-[42px] prose-h1:mb-8 
            [&_h2]:!text-[32px] [&_h2]:!font-normal prose-h2:mb-6 prose-h2:mt-10
            [&_h3]:!text-[22px] [&_h3]:!font-normal prose-h3:mb-4 prose-h3:mt-8
            prose-p:text-[17px] prose-p:leading-[1.8] prose-p:text-[#333] prose-p:mb-6
            prose-img:rounded-2xl prose-img:shadow-lg prose-img:my-10
            prose-ul:list-disc prose-ul:pl-6 prose-ul:mb-6
            prose-ol:list-decimal prose-ol:pl-6 prose-ol:mb-6
            prose-li:text-[17px] prose-li:leading-[1.8] prose-li:text-[#333] prose-li:mb-2
            prose-a:text-orange-600 prose-a:font-semibold prose-a:no-underline hover:prose-a:underline
            prose-strong:text-black prose-strong:font-bold"
          style={{ fontFamily: "'Work Sans', sans-serif" }}
        >
          <BlocksRenderer content={data.content} />
        </article>
      </div>
    </section>
  );
};

// Also Read Section
export const AlsoRead = ({ data }: { data: any }) => {
  if (!data?.linkUrl) return null;

  return (
    <div className="max-w-[900px] mx-auto px-4 my-12">
      {data.section_title && (
        <h2 className="text-[32px] !font-normal !font-sans mb-10 text-left text-black capitalize tracking-wide" style={{ fontSize: "32px !important", fontWeight: "400 !important" }}>
          {data.section_title}
        </h2>
      )}
      <div className="border-y border-gray-300 py-8 flex flex-col md:flex-row md:items-center gap-4 md:gap-10">
        <span 
          className="text-xl md:text-2xl font-bold text-black whitespace-nowrap"
          style={{ fontFamily: "'Work Sans', sans-serif" }}
        >
          {data.label || "Also Read"}
        </span>
        <a 
          href={data.linkUrl}
          className="text-[17px] md:text-lg text-[#666] hover:text-black transition-colors underline underline-offset-4 decoration-gray-400 hover:decoration-black"
          style={{ fontFamily: "'Work Sans', sans-serif", lineHeight: "1.5" }}
        >
          {data.linkText}
        </a>
      </div>
    </div>
  );
};

// Section Renderer
export default function SectionRenderer({ sections }: { sections: any[] }) {
  if (!sections || !Array.isArray(sections)) return null;

  return (
    <div className="w-full">
      {sections.map((section, index) => {
        const componentName = section.__component;
        const isNextFeatures = sections[index + 1]?.__component === 'sections.image-repeater';
        
        switch (componentName) {
          case 'sections.blog-quote':
            return <BlogQuote key={index} data={section} />;
          case 'sections.filled-box':
            return <FilledBox key={index} data={section} />;
          case 'sections.also-read':
            return <AlsoRead key={index} data={section} />;
          case 'sections.article':
            return <ArticleSection key={index} data={section} noMargin={isNextFeatures} />;
          case 'sections.hero':
            return <DynamicHero key={index} data={section} noMargin={isNextFeatures} />;
          case 'sections.hero-intro':
            return <HeroIntro key={index} data={section} noMargin={isNextFeatures} />;
          case 'sections.gallery':
            return <ImageGrid key={index} data={section} />;
          case 'sections.image-repeater':
            return <ImageRepeater key={index} data={section} />;
          case 'sections.content':
            return <div key={section.id} className={`prose prose-orange max-w-none mt-10 ${isNextFeatures ? 'mb-0' : ''}`}><Content data={section} noMargin={isNextFeatures} /></div>;
          case 'sections.pricing':
            return <Pricing key={index} data={section} />;
          case 'sections.pricing-tiers':
            return <PricingTiers key={index} data={section} />;
          case 'sections.faq':
            return <DynamicFAQ key={index} data={section} />;
          case 'sections.three-column-img-content':
          case 'sections.equal-grid':
            return <ThreeColumn key={index} data={section} />;
          case 'sections.expertise-content':
            return <ExpertiseList key={index} data={section} />;
          case 'sections.unsequenced-grid':
          case 'sections.unequal-grid':
            return <UnsequencedGrid key={index} data={section} />;
          case 'sections.cta':
            return <DynamicCTA key={index} data={section} />;
          case 'sections.slider':
            return <SliderSection key={index} data={section} />;
          case 'sections.image':
            return <ImageSection key={index} data={section} noMargin={isNextFeatures} />;
          case 'sections.contact':
            return <ContactSection key={index} data={section} />;
          case 'sections.two-column-img-content':
          case 'sections.image-text':
          case 'sections.image-text-highlighted':
            return <TwoColumn key={index} data={section} />;
          case 'sections.two-column-image':
            return <TwoColumnImage key={index} data={section} />;
          case 'sections.text-highlighted':
            return <TextHighlighted key={index} data={section} />;
          case 'sections.thank-you':
            return <ThankYou key={index} data={section} />;
          case 'sections.quote':
            return (
              <div key={index} className="prose prose-lg max-w-none prose-p:mb-4 prose-headings:font-bold prose-headings:text-black prose-headings:mb-4 prose-headings:mt-0 prose-h1:text-3xl prose-h2:text-2xl" 
                   style={{ fontFamily: "'Work Sans', sans-serif" }}>
                <Quote data={section} />
              </div>
            );
          default:
            return <div key={index} className="py-10 border border-dashed border-gray-300 text-center text-gray-400 mb-20 rounded-xl">
              Component "{componentName}" not implemented yet
            </div>;
        }
      })}
    </div>
  );
}
