import Link from 'next/link';
import { fetchStrapi, getStrapiMedia } from '@/lib/strapi';

export default async function Footer() {
  const currentYear = new Date().getFullYear();
  let globalSettings: any = null;

  try {
    globalSettings = await fetchStrapi('global?populate[0]=logo&populate[1]=footerDividerImage&populate[2]=facebookIcon&populate[3]=linkedinIcon&populate[4]=twitterIcon&populate[5]=skypeIcon');
  } catch (e) {
    console.error('Failed to fetch global settings for footer', e);
  }

  return (
    <>
      {/* Global Divider at bottom - restored */}
      {globalSettings?.footerDividerImage && (
        <section className="w-full bg-white">
          <div className="w-full flex justify-center pt-10 pb-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img 
              src={getStrapiMedia(globalSettings.footerDividerImage)} 
              alt="Divider" 
              className="h-[100px] w-auto object-contain"
            />
          </div>
        </section>
      )}

      <footer className="bg-white text-gray-800 pt-[70px] pb-[40px]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        
        {/* Horizontal Links */}
        <div className="flex flex-wrap justify-center gap-x-6 gap-y-3 text-[16px] font-normal text-black mb-10">
          <Link href="/process" className="pb-[1px] border-b border-[#e6602f] hover:text-[#f1592a] transition-all">Our Logo Design Process</Link>
          <Link href="/pricing" className="pb-[1px] border-b border-[#e6602f] hover:text-[#f1592a] transition-all">Logo Design Pricing</Link>
          <Link href="/faqs" className="pb-[1px] border-b border-[#e6602f] hover:text-[#f1592a] transition-all">Logo Design Faq</Link>
          <Link href="/blog" className="pb-[1px] border-b border-[#e6602f] hover:text-[#f1592a] transition-all">Blog</Link>
          <Link href="/contact" className="pb-[1px] border-b border-[#e6602f] hover:text-[#f1592a] transition-all">Contact Us</Link>
        </div>

        {/* Social Icons */}
        <div className="flex justify-center space-x-5 mb-[35px]">
          {globalSettings?.facebookUrl && globalSettings?.facebookIcon && (
            <a href={globalSettings.facebookUrl} target="_blank" rel="noopener noreferrer" className="hover:opacity-100 transition-opacity">
              <img src={getStrapiMedia(globalSettings.facebookIcon)} alt="Facebook" className="w-[16px] h-[16px] object-contain text-black" />
            </a>
          )}
          {globalSettings?.linkedinUrl && globalSettings?.linkedinIcon && (
            <a href={globalSettings.linkedinUrl} target="_blank" rel="noopener noreferrer" className="hover:opacity-100 transition-opacity">
              <img src={getStrapiMedia(globalSettings.linkedinIcon)} alt="LinkedIn" className="w-[16px] h-[16px] object-contain text-black" />
            </a>
          )}
          {globalSettings?.twitterUrl && globalSettings?.twitterIcon && (
            <a href={globalSettings.twitterUrl} target="_blank" rel="noopener noreferrer" className="hover:opacity-100 transition-opacity">
              <img src={getStrapiMedia(globalSettings.twitterIcon)} alt="Twitter" className="w-[16px] h-[16px] object-contain text-black" />
            </a>
          )}
          {globalSettings?.skypeUrl && globalSettings?.skypeIcon && (
            <a href={globalSettings.skypeUrl} target="_blank" rel="noopener noreferrer" className="hover:opacity-100 transition-opacity">
              <img src={getStrapiMedia(globalSettings.skypeIcon)} alt="Skype" className="w-[16px] h-[16px] object-contain text-black" />
            </a>
          )}
        </div>

        <div className="mx-auto">
          <div className="text-[15px] leading-[26px] text-[#666] flex flex-col items-center justify-center space-y-1">
            <p>
              {globalSettings?.helpLink1Text && (
                <>
                  <Link href={globalSettings.helpLink1Url || "#"} className="hover:text-[#e6602f] transition-colors">{globalSettings.helpLink1Text}</Link>
                  {" | "}
                </>
              )}
              {globalSettings?.helpLink2Text && (
                <>
                  <Link href={globalSettings.helpLink2Url || "#"} className="hover:text-[#e6602f] transition-colors">{globalSettings.helpLink2Text}</Link>
                  {" | "}
                </>
              )}
            </p>
            <div className="w-fit">
              <p>
                {globalSettings?.helpLink3Text && (
                  <>
                    <Link href={globalSettings.helpLink3Url || "#"} className="hover:text-[#e6602f] transition-colors">{globalSettings.helpLink3Text}</Link>
                    {" | "}
                  </>
                )}
                {globalSettings?.helpLink4Text && (
                  <>
                    <Link href={globalSettings.helpLink4Url || "#"} className="hover:text-[#e6602f] transition-colors">{globalSettings.helpLink4Text}</Link>
                    {" | "}
                  </>
                )}
              </p>
              {/* Horizontal Border Line - Matching text width */}
              <div className="w-full border-t border-[#0000000d] mt-8"></div>
            </div>
          </div>
        </div>

        {/* Copyright Bar */}
        <div className="w-full max-w-[1000px] mx-auto pt-8">
          <div className="text-[14px] leading-[24px] text-[#040404] text-center opacity-90">
            <p>
              Copyright {currentYear} © logoWhistle. A unit of <Link href="https://colorwhistle.com/" target="_blank" className="pb-[1px] border-b border-[#e6602f] hover:text-[#f1592a] transition-all">ColorWhistle</Link>. All rights reserved. DMCA Protected | <Link href="https://colorwhistle.com/privacy-policy/" target="_blank" className="pb-[1px] border-b border-[#e6602f] hover:text-[#f1592a] transition-all">Privacy Policy</Link> | <Link href="https://colorwhistle.com/terms-and-conditions/" target="_blank" className="pb-[1px] border-b border-[#e6602f] hover:text-[#f1592a] transition-all">Terms and Conditions</Link>
            </p>
          </div>
        </div>
        
      </div>
    </footer>
    </>
  );
}

