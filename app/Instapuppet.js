var Instapuppet = {};

const puppeteer = require('puppeteer');
const log = require('./Helpers').log;


var awaitTimeout = async (promise, duration) => {

  let timeout = new Promise((resolve, reject) => {
    setTimeout(() => resolve("timeout!", duration));
  });
  return Promise.race(promise, timeout);
}


Instapuppet.autoscroll = async (args) => {
  await args.page.evaluate(async () => {
    await new Promise((resolve, reject) => {
      var totalHeight = 0;
      var distance = 100;
      var runs = 0;
      var timer = setInterval(() => {
        var scrollHeight = document.body.scrollHeight;
        window.scrollBy(0, distance);
        totalHeight += distance;

        if(totalHeight >= scrollHeight || runs > args.times){
          clearInterval(timer);
          resolve();
        }
        runs += 1;
      }, 100);
    });
  });
}


Instapuppet.simplescroll = async (args) => {
  await args.page.evaluate(async () => {
    var totalHeight = 0;
    var distance = 100;
    var runs = 0;
    var scrollHeight = document.body.scrollHeight;
    window.scrollBy(0, scrollHeight);
  });
}

Instapuppet.scroll_to_bottom = async(args) => {

  //    await args.page.screenshot({path: `beforescroll.png`, fullPage: true});

  for (let i = 0; i < args.times; i++) {
    log(0, "..scrolling..");
    try {
      await Instapuppet.simplescroll({ page: args.page });
      await args.page.waitFor(500);
    } catch(err) {
    log(0, err);
    }
  }
  console.log("loopdone");
  //    await args.page.screenshot({path: `afterscroll.png`, fullPage: true});

  return
}

Instapuppet.get_recent_posts_from_page = async(args) =>  {
  // args should have page
  var shortcodes = await args.page.evaluate(() => {
    var mostrecenttext = document.evaluate("//h2[contains(., 'Most recent')]", document, null, XPathResult.ANY_TYPE, null ).iterateNext();

    if(mostrecenttext == null) { return []; } // sometimes the most recent text is not shown.. Instagram: "We may remove the Top or Recent posts in a hashtag page if people are using the hashtag to post abusive content in a highly visible place. Learn more about our Community Guidelines."

    var mostrecentdiv = document.evaluate("//h2[contains(., 'Most recent')]", document, null, XPathResult.ANY_TYPE, null ).iterateNext().nextSibling;
    var shortcodes = [...mostrecentdiv.querySelectorAll("a")].map((x) => {
      return x.getAttribute("href").match(/p\/(.*)\//)[1]; 
    })
    return shortcodes
  })
  return shortcodes
}



Instapuppet.get_post_info = async (args) => {
  // args should have "url" and "page"
  var url = `https://www.instagram.com/p/${args.sc}`;
  await args.page.goto(url);
  var postinfo = await args.page.evaluate((hashtag) => {
    var atags = document.getElementsByTagName("a");
    var maybelocationtag = [...atags].filter((x) => {
      return x.href.match(/instagram\.com\/explore\/locations\/(.*)\//) !== null
    });

    // get username by finding a tag that has the same inner text and href
    var username = [...atags].filter((x) => {
      return x.innerText.length > 0 && x.getAttribute("href").replace(/\//g, "").toUpperCase() === x.innerText.toUpperCase();
    })[0].innerText;

    // get posttext by. finding
    var posttext = "";

    try {
      posttext = [...document.getElementsByTagName("a")].filter((x) => {
        return x.innerText.toUpperCase() == "#" + hashtag.toUpperCase()
      })[0].parentElement.innerText;
    } catch(err) {
      console.log(err);
    }


    var thispost = { "username": username, "posttext": posttext };
    if(maybelocationtag.length > 0) {
      // we have a winner
      thispost = {...thispost, ...{"haslocation": true, "locationhref": maybelocationtag[0].href, "locationname": maybelocationtag[0].innerText }};
    } else {
      thispost = {...thispost, ...{"haslocation": false}}
    }
    return thispost

  }, args.hashtag);
  postinfo["url"] = url;
  postinfo["sc"] = args.sc;
  postinfo["hashtag"] = args.hashtag;
  return postinfo
}



Instapuppet.get_location_coordinates = async (args) => {
  await args.page.goto(args.locationhref)
  return args.page.evaluate(() => {
    var coords = {};
    coords.lat = document.querySelector("meta[property='place:location:latitude']").content;
    coords.lon = document.querySelector("meta[property='place:location:longitude']").content;
    return coords;
  });
}






Instapuppet.get_posts_with_locations_by_hashtag = async (hashtag) => { 

  log(0, "===" + hashtag + "==> Starting Puppeteer/Chromium browser and page...") 
  const browser = await puppeteer.launch({ headless: true });
  var page = await browser.newPage();
  log(0, " Done! \n");

  var posts = [];
  try {
    posts = await Instapuppet._get_posts_with_locations_by_hashtag(page, hashtag);
  } catch(err) {
    log("\nXXXX We've got an error! Taking a screenshot....")
    await page.screenshot({path: `error_screenshot.png`, fullPage: true});
    throw(err);
  }

  log(0, "===" + hashtag + "==> Closing browser... ");
  await browser.close();
  log(0, " Done! \n");

  return posts;

}


Instapuppet._get_posts_with_locations_by_hashtag = async (page,hashtag) => { 

  const tag_url_base = 'https://www.instagram.com/explore/tags/';
  //var hashtag = "sunnyxmas";
  var url = tag_url_base + hashtag;



  log(0, "===" + hashtag + "==> Going to url: " + url + "...")
  await page.goto(url);
  log(0, " Done! \n");




  log(0, "===" + hashtag + "==> Scrolling...")

  await Instapuppet.scroll_to_bottom({ "page": page, "times": 3 })
  log(0, " Done! \n");






  log(0, "===" + hashtag + "==> Getting the shortcodes/urls of most recent posts... ")

  var shortcodes = await Instapuppet.get_recent_posts_from_page({ "page": page });
  log(0, " Done! \n");

  log(0, shortcodes.join("\n") + "\n");




  log(0, "===" + hashtag + "==> Finding most recent posts that have a location...\n");

  var posts_with_locations = []

  for(const sc of shortcodes) {
    //    for(const sc of shortcodes.slice(0,3)) { // for debugging

    log(0, sc + "... ");

    var postinfo = {};
    postinfo = await Instapuppet.get_post_info({ "sc": sc, "hashtag": hashtag, "page": page});

    if(postinfo.haslocation == true) {

      log(0, " YES, has a location: " + postinfo.locationhref + "\n");
      log(2, "--- Looking up this location coordinates... ")

      var location_coordinates = await Instapuppet.get_location_coordinates({ "locationhref": postinfo.locationhref, "page": page })

      // we have the post info!
      this_post = {...postinfo, ...location_coordinates}

      log(0, `lat: ${location_coordinates.lat}, lon: ${location_coordinates.lon}`)

      //console.log("");  console.log(this_post);
      posts_with_locations.push(this_post);

      log(0, " Done!. \n");

    } else {
      log(0, " No location.\n");
    }

    //        await page.screenshot({path: `example_${sc}.png`, fullPage: true});
  }
  log(0, " Done getting locations of all recent posts! \n");


  return posts_with_locations;

};



module.exports = Instapuppet;









