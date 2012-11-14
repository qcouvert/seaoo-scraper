
var jsdom = require('jsdom');
var async = require('async');
var Step = require('step');

var IndexJob = require('./index_job.js');
var CategoryJob = require('./category_job.js');
var NoticeJob = require('./notice_job.js');

function Scraper(db, interval, notifier) {
    this.db = db;
    this.index_interval = interval.index*1000; // ms
    this.category_interval = interval.category*1000; // ms
    this.notifier = notifier;
}
module.exports = Scraper;

Scraper.prototype.start = function() {
    // scrape index every 12h
    setInterval(this.scrapeIndex.bind(this), 12*3600*1000);
    this.scrapeIndex();

    // scrape a category every 15m (all category ~x2/day)
    setInterval(this.scrapeCategory.bind(this), 50*15*1000);
    this.scrapeCategory();
    
    // scrape a new notice every 5s
    setInterval(this.scrapeNotice.bind(this), 60*5*1000);
};

Scraper.prototype.scrapeIndex = function() {
    new IndexJob(this.db);
};

Scraper.prototype.scrapeCategory = function() {
    var Category = this.db.model('Category');
    var qry = Category.findOne({
        update: {$lt: Date.now()-this.category_interval},
        scraping: false
    }).sort('update')
      .exec(scrapeCategory.bind(this));
};

function scrapeCategory(err, category) {
    if(err) {
        console.error('Error finding category to scrape:', err);
        console.error(err.stack);
        return;
    }
    if(!category) {
        return;
    }
    category.scraping = true;
    category.save();
    new CategoryJob(this.db, category.slug, 1, function(err) {
        category.scraping = false;
        if(!err) {
            category.update = Date.now();
        }
        category.save();
    });
}

Scraper.prototype.scrapeNotice = function() {
    var Notice = this.db.model('Notice');
    Notice.findOne({
        toScrape: true,
        scraping: false
    }, scrapeNotice.bind(this));
};

function scrapeNotice(err, notice) {
    if(err) {
        console.error('Error finding notice to scrape:', err);
        console.error(err.stack);
    }
    if(!notice) {
        return;
    }
    notice.scraping = true;
    notice.save();
    new NoticeJob(this.db, notice.itemId, function(err) {
        notice.scraping = false;
        if(!err) {
            notice.toScrape = false;
        }
        notice.save();
    });
}


var noTags = ['le', 'la', 'de'];
function _scrapeNotice(notice, cat, cb) {
    var Notice = this.db.model('Notice');
    console.log('Will scrape notice:', notice.itemId);
    new NoticeJob(notice.itemId, cat, function(err, notice) {
        if(err) {
            cb(err);
        }
        else {
            var description = notice.description + ' ' + notice.Title;
            var tags = [];
            descTags = description.split(' ');
            for(var i=0; i<descTags.length; i++) {
                descTags[i] = descTags[i].trim().toLowerCase();
                if(tags.indexOf(descTags[i]) === -1 && noTags.indexOf(descTags[i]) === -1) {
                    tags.push(descTags[i]);
                }
            }
            if(notice.categories) {
                notice.categories = Object.keys(notice.categories);
            }
            notice.tags = tags;
            Notice.create(notice, cb);
        }
    });
}
