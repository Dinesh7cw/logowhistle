const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const getFooterData = async (url) => {
    const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
    await page.goto(url);
    await page.waitForTimeout(2000);
    const data = await page.evaluate(() => {
      const footer = document.querySelector('footer');
      if (!footer) return null;
      
      const footerStyles = window.getComputedStyle(footer);
      
      // Footer menu links
      const linksContainer = footer.querySelector('ul, .menu-footer-menu-container') || footer;
      let navLinks = [];
      const anchors = Array.from(linksContainer.querySelectorAll('a')).filter(a => ['Our Logo Design Process', 'Logo Design Pricing', 'Logo Design Faq', 'Blog', 'Contact Us'].includes(a.innerText.trim()));
      
      navLinks = anchors.map(a => {
        const s = window.getComputedStyle(a);
        const before = window.getComputedStyle(a, '::before');
        return {
          text: a.innerText,
          fontSize: s.fontSize,
          fontFamily: s.fontFamily,
          padding: s.padding,
          margin: s.margin,
          borderBottom: s.borderBottom,
          textDecoration: s.textDecoration,
          beforeContent: before.content,
          beforeBorderBottom: before.borderBottom
        };
      });
      
      // Copyright
      const copyright = Array.from(footer.querySelectorAll('p')).find(p => p.innerText.includes('Copyright'));
      let copyrightStyle = null;
      if (copyright) {
        const s = window.getComputedStyle(copyright);
        copyrightStyle = {
          fontSize: s.fontSize,
          fontFamily: s.fontFamily,
          padding: s.padding,
          margin: s.margin,
          color: s.color,
          textAlign: s.textAlign
        };
      }

      return {
        footerBorderTop: footerStyles.borderTop,
        footerPadding: footerStyles.padding,
        navLinks: navLinks.slice(0, 5),
        copyrightStyle
      };
    });
    await page.close();
    return data;
  };

  const liveData = await getFooterData('https://logowhistle.com/');
  const localData = await getFooterData('http://localhost:3000/');
  
  console.log(JSON.stringify({ live: liveData, local: localData }, null, 2));
  await browser.close();
})();
