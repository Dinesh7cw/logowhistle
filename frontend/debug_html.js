async function test() {
  try {
    const res = await fetch('http://127.0.0.1:3000/blog');
    const text = await res.text();
    
    console.log('--- HTML Debug Check ---');
    const hasDebugLabel = text.includes('DEBUG: Hero Image Missing');
    const hasImgTag = text.includes('<img');
    const hasDivider = text.includes('Logo_Whistle_divider');
    
    console.log('Data missing label found:', hasDebugLabel);
    console.log('Img tag found:', hasImgTag);
    console.log('Divider image in HTML:', hasDivider);
    
    if (hasImgTag) {
        const matches = text.match(/<img[^>]*>/g);
        console.log('Found img tags:', matches);
    }
  } catch (err) {
    console.error('Fetch error:', err.message);
  }
}
test();
