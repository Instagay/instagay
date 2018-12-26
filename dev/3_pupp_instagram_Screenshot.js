const puppeteer = require('puppeteer');

(async() => { 
  const browser = await puppeteer.launch({
    headless: true
  });
  const page = await browser.newPage();

  await page.goto('https://www.instagram.com/explore/tags/sunnyxmas/');
// await page.addScriptTag({url: 'https://code.jquery.com/jquery-3.3.1.slim.min.js'});

  const viewPortHeight = await page.viewport().height

  let previousHeight = await page.evaluate('document.body.scrollHeight');
  await page.evaluate('window.scrollTo(0, document.body.scrollHeight)');
  await page.waitForFunction(`document.body.scrollHeight > ${previousHeight}`);
  await page.waitFor(500)

  await page.evaluate(() => {
   var mostrecentdiv = document.evaluate("//h2[contains(., 'Most recent')]", document, null, XPathResult.ANY_TYPE, null ).iterateNext().nextSibling;
  mostrecentdiv.style.backgroundColor = "blue";
  });

  // so this is working
  // TODO: create code to find links, click on then, scan for location, etc

  await page.screenshot({path: 'example.png', fullPage: true});

  await browser.close();

})();
