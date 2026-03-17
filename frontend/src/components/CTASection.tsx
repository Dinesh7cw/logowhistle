import Link from 'next/link';

interface CTASectionProps {
  title?: string;
  description?: string;
  buttonLabel?: string;
  buttonUrl?: string;
}

export default function CTASection({ title, description, buttonLabel, buttonUrl }: CTASectionProps) {
  if (!title && !description) return null;

  return (
    <section className="w-full bg-white pt-20 pb-4 px-4 text-center">
      <div className="max-w-[760px] mx-auto">
        <h2 className="text-[40px] md:text-[65px] leading-[1.1] md:leading-[71.5px] font-medium font-serif text-[#000] text-center mb-4">
          {title && (
            <>
              <strong className="text-[#e6602f] font-medium">{title.split(' ').slice(0, 2).join(' ')}</strong>
              <br className="hidden md:block" />
              {title.split(' ').slice(2).join(' ')}
            </>
          )}
        </h2>

        {description && (
          <p className="text-[16px] leading-[28.8px] text-[#000] text-center mb-[15px]">
            {description}
          </p>
        )}

        {buttonLabel && (
          <Link
            href={buttonUrl || "/contact"}
            className="inline-block mt-[15px] px-8 py-4 border-2 border-black text-[16px] font-medium text-black hover:bg-[#e6602f] hover:text-white hover:border-[#e6602f] transition-colors rounded-none"
          >
            {buttonLabel}
          </Link>
        )}
      </div>
    </section>
  );
}
