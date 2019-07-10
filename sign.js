const puppeteer = require('puppeteer');
require('dotenv').config();
const fs = require('fs');

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
  await page.goto('https://medium.com/m/signin');

  await page.click('button[data-action="sign-in-prompt"]');
  await page.waitFor(2000);

  await page.click('button[data-action="google-auth"]');
  await page.waitFor(2000);

  await page.type('input[name="identifier"]', process.env.email);
  await page.click('#identifierNext');
  await page.waitFor(2000);

  await page.type('input[name="password"]', process.env.password);
  await page.click('#passwordNext');
  await page.waitFor(10000);

  await page.screenshot({path: 'signined.png', fullpage: true});


  await browser.close();
})();
