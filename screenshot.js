const puppeteer = require('puppeteer');
(async () => {
  try {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 800 });
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle2', timeout: 30000 });
    await page.screenshot({ path: 'screenshot.png' });
    await browser.close();
    console.log("Screenshot saved to screenshot.png");
  } catch(e) {
    console.error(e);
  }
})();
