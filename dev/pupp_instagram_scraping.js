const puppeteer = require('puppeteer');

var url = "https://www.instagram.com/explore/tags/sunnyxmas/";
var url2 = "https://www.instagram.com/explore/tags/instagay/";

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  await page.goto(url);
  var stuff = await page.evaluate(() => {
    return _sharedData.entry_data.TagPage[0].graphql.hashtag.edge_hashtag_to_media.count;
  });
  console.log(stuff);

  await page.goto(url2);
  var stuff = await page.evaluate(() => {
    return _sharedData.entry_data.TagPage[0].graphql.hashtag.edge_hashtag_to_media.count;
  });
  console.log(stuff);

//  await page.screenshot({path: 'example.png'});

  await browser.close();
})();
