const fs = require('fs');
const html = fs.readFileSync('ref_faq.html', 'utf8');

const regex = /<h3>(.*?)<\/h3>\s*([\s\S]*?)(?=<h3>|<\/div>)/g;
const items = [];
let match;

// We only want matches from the faq-section
const faqSectionMatch = html.match(/<section id="block_dc3fa78a604d46368f3826f438403c38"[\s\S]*?<\/section>/);
if (faqSectionMatch) {
  const faqSection = faqSectionMatch[0];
  while ((match = regex.exec(faqSection)) !== null) {
    const q = match[1].trim();
    const a = match[2].trim();
    if (q && a) items.push({ q, a });
  }
}

fs.writeFileSync('faq_data.json', JSON.stringify(items, null, 2));
console.log('Saved ' + items.length + ' items to faq_data.json');
