"use client";

import { useState } from 'react';

export default function ContactForm({ description }: { description?: string }) {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');

    const formData = new FormData(e.target as HTMLFormElement);
    const data = {
      data: {
        name: formData.get('name'),
        email: formData.get('email'),
        phone: formData.get('phone'),
        message: formData.get('message'),
      }
    };

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        console.error('Submission Error:', errData);
        throw new Error('Submission failed');
      }
      setStatus('success');
    } catch (err) {
      console.error('Form Submit Error:', err);
      setStatus('error');
    }
  };

  if (status === 'success') {
    return (
      <div className="h-full flex flex-col justify-center items-center text-center p-8 bg-gray-50 rounded-lg">
        <h3 className="text-2xl font-bold text-black mb-4">Thank You!</h3>
        <p className="text-[#222]">Your message has been sent successfully. We will whistle back shortly.</p>
        <button onClick={() => setStatus('idle')} className="mt-8 text-black font-bold uppercase tracking-widest text-xs border-b border-black">Send another message</button>
      </div>
    );
  }

  return (
    <div className="h-full">
      {description && (
        <p className="text-[17px] text-[#222] font-sans font-normal mb-10 leading-[1.6]">
          {description}
        </p>
      )}
      
      <form className="space-y-10" onSubmit={handleSubmit}>
        <div className="relative">
          <input 
            type="text" 
            name="name"
            placeholder="NAME"
            required
            className="w-full bg-transparent border-b border-[#aaa] py-4 px-0 focus:border-black outline-none transition-colors text-[16px] font-sans text-black font-bold tracking-[0.2em] placeholder:text-[#999] placeholder:text-[16px]"
          />
        </div>

        <div className="relative">
          <input 
            type="email" 
            name="email"
            placeholder="EMAIL"
            required
            className="w-full bg-transparent border-b border-[#aaa] py-4 px-0 focus:border-black outline-none transition-colors text-[16px] font-sans text-black font-bold tracking-[0.2em] placeholder:text-[#999] placeholder:text-[16px]"
          />
        </div>

        <div className="relative">
          <input 
            type="tel" 
            name="phone"
            placeholder="PHONE"
            className="w-full bg-transparent border-b border-[#aaa] py-4 px-0 focus:border-black outline-none transition-colors text-[16px] font-sans text-black font-bold tracking-[0.2em] placeholder:text-[#999] placeholder:text-[16px]"
          />
        </div>

        <div className="relative">
          <textarea 
            name="message"
            placeholder="MESSAGE"
            required
            className="w-full bg-transparent border-b border-[#aaa] py-4 px-0 focus:border-black outline-none transition-colors text-[16px] font-sans text-black font-bold tracking-[0.2em] placeholder:text-[#999] placeholder:text-[16px] h-[160px] resize-none"
          ></textarea>
        </div>

        {status === 'error' && (
          <p className="text-red-600 text-sm">Something went wrong. Please try again later.</p>
        )}

        <div className="pt-6">
          <button 
            type="submit"
            disabled={status === 'loading'}
            className="w-full px-16 py-6 border-2 border-black bg-white text-black text-[13px] font-bold uppercase tracking-[0.2em] hover:bg-black hover:text-white transition-all duration-300 disabled:opacity-50 cursor-pointer"
          >
            {status === 'loading' ? 'SENDING...' : 'Send Message'}
          </button>
        </div>
      </form>
    </div>
  );
}
