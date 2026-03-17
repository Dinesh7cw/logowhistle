'use client';

import { useState } from 'react';
import { getStrapiMedia } from '@/lib/strapi';
import { parseMarkdown } from "@/lib/markdown";
import DOMPurify from 'isomorphic-dompurify';
import Image from 'next/image';

export const SliderSectionClient = ({ data }: { data: any }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const slides = data.slides || [];

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % slides.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);

  if (!slides.length) return null;

  return (
    <section className="mb-20 overflow-hidden relative group">
      <div 
        className="flex transition-transform duration-500 ease-in-out" 
        style={{ transform: `translateX(-${currentSlide * 100}%)` }}
      >
        {slides.map((slide: any, idx: number) => (
          <div key={idx} className="min-w-full relative h-[500px]">
            {slide.image && (
              <Image 
                src={getStrapiMedia(slide.image)} 
                alt={slide.title} 
                fill
                className="w-full h-full object-cover" 
              />
            )}
            <div className="absolute inset-0 bg-black/30 flex flex-col justify-center px-20 text-white">
              <h3 className="text-4xl font-bold mb-4">{slide.title}</h3>
              <div className="text-lg max-w-xl mb-8" dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(parseMarkdown(slide.description)) }} />
              {slide.button_text && (
                <a href={slide.button_link} className="bg-white text-black px-6 py-3 rounded-full font-bold w-fit hover:bg-orange-600 hover:text-white transition-all">
                  {slide.button_text}
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
      
      {/* Navigation Buttons */}
      {slides.length > 1 && (
        <>
          <button 
            onClick={prevSlide}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 p-3 rounded-full text-white backdrop-blur-sm transition-all opacity-0 group-hover:opacity-100"
          >
            ←
          </button>
          <button 
            onClick={nextSlide}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 p-3 rounded-full text-white backdrop-blur-sm transition-all opacity-0 group-hover:opacity-100"
          >
            →
          </button>

          {/* Indicators */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
            {slides.map((_: any, i: number) => (
              <button
                key={i}
                onClick={() => setCurrentSlide(i)}
                className={`w-2.5 h-2.5 rounded-full transition-all ${currentSlide === i ? 'bg-orange-600 w-8' : 'bg-white/50'}`}
              />
            ))}
          </div>
        </>
      )}
    </section>
  );
};
