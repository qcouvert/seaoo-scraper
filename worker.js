

// Database
var mongoose = require('mongoose');
var db = mongoose.createConnection(process.env.MONGODB);

// models
require('./models')(db);

// scraper
var Scraper = require('./lib/scraper.js');

var scrap = new Scraper(db, process.env.SCRAPE_INTERVAL);

console.log('Start worker!');
scrap.start();

