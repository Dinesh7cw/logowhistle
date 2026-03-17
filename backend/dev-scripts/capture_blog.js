const { chromium } = require('playwright');
const path = require('path');

async function capture() {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  try {
    console.log('Navigating to blog page...');
    await page.goto('http://localhost:3000/blog', { waitUntil: 'networkidle' });
    
    // Check for "Logo Design Blog"
    const heading = await page.textContent('h1');
    console.log('Heading found:', heading);

    // Hover over the first blog title
    const firstTitle = await page.locator('h2').first();
    const box = await firstTitle.boundingBox();
    if (box) {
      await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
      console.log('Hovered over title.');
      // Wait for image animation
      await page.waitForTimeout(1000);
    }

    const screenshotPath = path.resolve('d:/logowhistle/logowhistle-clone/backend/blog_verif_manual.png');
    await page.screenshot({ path: screenshotPath, fullPage: true });
    console.log('Screenshot saved to:', screenshotPath);
  } catch (err) {
    console.error('Error during capture:', err);
  } finally {
    await browser.close();
  }
}

capture();
