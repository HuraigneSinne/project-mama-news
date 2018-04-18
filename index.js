// Node server
const express = require("express");
const app = express();

// Scraping
const cheerio = require("cheerio");
const fetch = require("node-fetch");

const NEWS_URL = "https://www.polesantetravail.fr/actualites/";

// Base de données
const firebase = require("firebase/app");
const firestore = require("firebase/firestore");

const config = require("./firebase-config");

firebase.initializeApp(config);

const fetchNews = async () => {
  // Requête Ajax
  const request = await fetch(NEWS_URL);
  const html = await request.text();

  // On charge l'html pour cheerio
  const $ = cheerio.load(html);

  // On récupère les divs des articles
  const $newsList = $(".entry-content");

  // Puis on loop et on récupère ce qui nous intéresse
  const urls = [];
  const titles = [];
  const summaries = [];
  $newsList.each((i, $news) => {
    urls.push($(".title a", $news)[0].attribs.href);
    titles.push($(".title a", $news)[0].children[0].data);
    summaries.push($("p", $news)[1].children[0].data);
  });

  return {
    urls: urls,
    titles: titles,
    summaries: summaries
  };
};

const setNews = async news => {
  const db = firebase.firestore();

  // insertion dans la bdd
  db
    .collection("news")
    .doc("actualites")
    .set(news)
    .then(function() {
      console.log("Document successfully written!");
    })
    .catch(function(error) {
      console.error("Error writing document: ", error);
    });
};

const scrapNews = async () => {
  const news = await fetchNews();
  setNews(news);
};

setInterval(scrapNews, 10000);

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log(`Your app is listening on port ${listener.address().port}`);
});
