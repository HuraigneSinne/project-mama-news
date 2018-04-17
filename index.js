const cheerio = require("cheerio");
const fetch = require("node-fetch");

const NEWS_URL = "https://www.polesantetravail.fr/actualites/";

const urls = [];
const titles = [];
const summaries = [];

const fetchNews = async () => {
  const request = await fetch(NEWS_URL);
  const html = await request.text();
  const $ = cheerio.load(html);
  const $newsList = $(".entry-content");

  $newsList.each((i, $news) => {
    urls.push($(".title a", $news)[0].attribs.href);
    titles.push($(".title a", $news)[0].children[0].data);
    summaries.push($("p", $news)[1].children[0].data);
  });

  return urls, titles, summaries;
};

fetchNews();
