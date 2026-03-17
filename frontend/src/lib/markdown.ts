/**
 * Simple markdown parser to convert basic markdown (headings, paragraphs) 
 * into HTML for components that receive raw markdown from Strapi.
 */
export function parseMarkdown(text: string): string {
  if (!text) return "";

  // 1. Process Headings
  let html = text
    .replace(/^# (.*$)/gm, '<h1 class="text-[28px] md:text-[32px] font-bold font-serif !mb-0 mt-2 text-black leading-tight">$1</h1>')
    .replace(/^## (.*$)/gm, '<h2 class="text-[24px] md:text-[28px] font-bold font-serif !mb-0 mt-2 text-black leading-tight">$1</h2>')
    .replace(/^### (.*$)/gm, '<h3 class="text-[20px] md:text-[24px] font-bold font-serif !mb-0 mt-2 text-black leading-tight">$1</h3>')
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>');

  // 2. Process Paragraphs (split by double newline)
  const blocks = html.split(/\n\n+/);
  html = blocks.map(block => {
    const trimmed = block.trim();
    if (!trimmed) return "";
    // If it's already a heading, don't wrap in <p>
    if (trimmed.startsWith('<h')) return trimmed;
    // Otherwise wrap in paragraph with margin-bottom: 0 as requested
    return `<p class="!mb-0 text-[16px] leading-[1.6] text-black">${trimmed.replace(/\n/g, '<br />')}</p>`;
  }).join('\n');

  return html;
}
