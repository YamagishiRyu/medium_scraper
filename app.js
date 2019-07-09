const puppeteer = require('puppeteer');

(async () => {
    const browser = await puppeteer.launch({
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox'
      ],
      headless: false,
      slowMo: 50
    });
  const page = await browser.newPage();
  await page.setViewport({ width: 1366, height: 2000 });
  await page.goto('https://medium.com/topic/popular');
  await page._client.send(
      'Input.synthesizeScrollGesture',
      {
        x: 0,
        y: 0,
        xDistance: 0,
        yDistance: -3500,
        speed: 2000,
        repeatCount: 5,
        repeatDelayMs: 200
      }
    );
  console.log('scrolled')

  await browser.close();
})();
