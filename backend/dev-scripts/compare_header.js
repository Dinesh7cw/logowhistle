const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const getHeaderData = async (url) => {
    const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
    await page.goto(url);
    await page.waitForTimeout(2000);
    const data = await page.evaluate(() => {
      const header = document.querySelector('header') || document.querySelector('nav');
      if (!header) return null;
      
      const navLinks = Array.from(header.querySelectorAll('a')).filter(a => ['Process', 'Pricing', 'Portfolio', 'Faq', 'Blog'].includes(a.innerText.trim())).map(a => {
        const s = window.getComputedStyle(a);
        return {
          text: a.innerText,
          fontSize: s.fontSize,
          fontFamily: s.fontFamily,
          fontWeight: s.fontWeight,
          padding: s.padding,
          margin: s.margin
        };
      });
      
      const contactBtn = Array.from(header.querySelectorAll('a')).find(a => a.innerText.trim() === 'Contact Us');
      let contactStyle = null;
      if (contactBtn) {
        const s = window.getComputedStyle(contactBtn);
        const before = window.getComputedStyle(contactBtn, '::before');
        contactStyle = {
          fontSize: s.fontSize,
          fontFamily: s.fontFamily,
          padding: s.padding,
          margin: s.margin,
          beforeContent: before.content,
          beforeBorderBottom: before.borderBottom
        };
      }

      return {
        navLinks, 
        contactStyle
      };
    });
    await page.close();
    return data;
  };

  const liveData = await getHeaderData('https://logowhistle.com/');
  const localData = await getHeaderData('http://localhost:3000/');
  
  console.log(JSON.stringify({ live: liveData, local: localData }, null, 2));
  await browser.close();
})();
