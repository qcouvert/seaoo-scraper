

// Database
var mongoose = require('mongoose');
var dataDB = mongoose.createConnection(process.env.DATA_DB);
var subscrDB = mongoose.createConnection(process.env.SUBSCRIBE_DB);
// models
require('./models')(dataDB, subscrDB);


// mnotification sender
//var Notifier = require('./lib/notifier.js');
//var notifier = new Notifier(dataDB, subscrDB, process.env.SENDGRID_USERNAME, process.env.SENDGRID_PASSWORD);

// scraper
var Scraper = require('./lib/scraper.js');
var scrap = new Scraper(dataDB, {
    index: 3600*2, // scrape index every 2 hours
    category: process.env.SCRAPE_INTERVAL
});


console.log('Start worker!');
scrap.start();

