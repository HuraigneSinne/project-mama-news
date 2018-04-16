const $ = require("cheerio");
const fetch = require("node-fetch");

const NEWS_URL = "https://www.polesantetravail.fr/actualites/";

const fetchNews = async () => {
  const request = await fetch(NEWS_URL);
  const html = await request.text();

  console.log(html);
};

fetchNews();
