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
  console.log('scrolled');

  // get url information
  const post_selector = '#root > div > section > section.y.cs.ab.n > div:nth-child(3) > div.ez.fa.n > section'
  post_info_array = await page.$$eval(post_selector, nodes => nodes.map(element => {
    return {
      title: element.querySelector('h3').innerText,
      url: element.querySelector('h3 a').href
    }
  }));
  console.log('post info done');

  // get post for post page

  for(var i = 0, l = post_info_array.length; i < l; i++){
    url = post_info_array[i].url;
    await page.goto(url, {waitUntil: 'networkidle2'});
    await page.waitFor(1000);
    await page.mouse.click(10,10);
    
    info_json = await page.$eval('head > script[type="application/ld+json"]', el => el.innerText);
    console.log(info_json)
  }

  await browser.close();
})();
