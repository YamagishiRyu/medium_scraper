const puppeteer = require('puppeteer');
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
  const post_selector = '#root > div > section > section.y.cs.ab.n > div:nth-child(3) > div > section'
  post_info_array = await page.$$eval(post_selector, nodes => nodes.map(element => {
    return {
      title: element.querySelector('h3').innerText,
      url: element.querySelector('h3 a').href
    }
  }));
  console.log('post info done');
  console.log('post data: ' + post_info_array.length);

  // get post for post page

  var file = fs.createWriteStream('medium_posts.csv', {flags: 'a+'});
  file.write('id,title,author_name,texts,keywords,created_at\n')
  for(var i = 0, l = post_info_array.length; i < l; i++){
    url = post_info_array[i].url;
    await page.goto(url, {waitUntil: 'networkidle2'});
    await page.waitFor(1000);
    await page.mouse.click(10,10);
    
    info_json = await page.$eval('head > script[type="application/ld+json"]', el => JSON.parse(el.innerText));
    id = info_json.articleId;
    title = info_json.name;
    author_name = info_json.author.name;
    keywords = info_json.keywords.join('|')
    created_at = info_json.dateCreated
    texts = await page.$$eval('article p', nodes => nodes.map(element => {
      return element.innerText;
    }))
    text = texts.join(' ');

    file.write(id + ',†' + title + '†,' + author_name + ',†' + text + '†,' + keywords + ',' + created_at + '\n');
  }

  file.end();

  await browser.close();
})();
