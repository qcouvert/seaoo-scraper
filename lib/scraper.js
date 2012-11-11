
var jsdom = require('jsdom');
var async = require('async');
var Step = require('step');

var IndexJob = require('./index_job.js');
var CategoryJob = require('./category_job.js');
var NoticeJob = require('./notice_job.js');

function Scraper(db, interval) {
    this.db = db;
    this.interval = interval*1000; // ms
}
module.exports = Scraper;

Scraper.prototype.start = function() {
    new IndexJob(getCategories.bind(this));
};

function getCategories(err, results) {
    if(err) {
        return this.end(err);
    }
    var Category = this.db.model('Category');
    var scraper = this;
    var catsToScrape = [];
    var noticesToScrape = [];
    Step(function(){
        var group = this.group();
        for(var i=0; i<results.length; i++) {
            if(results[i].id) {
                Category.update({
                    slug: results[i].id
                }, {
                    slug: results[i].id,
                    name: results[i].name
                }, {
                    upsert: true
                }, group());
                catsToScrape.push(results[i].id);
            }
        }
    }, function(err) {
        if(err) {
            return scraper.end(err);
        }
        var catsJob = [];
        for(var i=0; i<catsToScrape.length && i<3; i++) {
            catsJob.push(scrapeCategory.bind(scraper, catsToScrape[i]));
        }
        async.series(catsJob, this);
    }, function(err, results) {
        if(err) {
            return scraper.end(err);
        }
        var noticesJob = [];
        for(var i=0; i<results.length; i++) {
            var notices = results[i].notices;
            for(var j=0; j<notices.length; j++) {
                var notice = notices[j];
                if(noticesToScrape.indexOf(notice.itemId) === -1) {
                    noticesToScrape.push(notice.itemId);
                    noticesJob.push(scrapeNotice.bind(scraper, notice, results[i].id));
                }
            }
        }
        async.series(noticesJob, this);
    }, function(err) {
        scraper.end(err);
    });
}

function scrapeCategory(id, cb) {
    console.log('Will scrape category:', id);
    new CategoryJob(id, cb);
}

function scrapeNotice(notice, cat, cb) {
    console.log('Will scrape notice:', notice.itemId);
    var Notice = this.db.model('Notice');
    Notice.update({
        itemId: notice.itemId
    }, notice, {
        upsert: true
    }, function(err, res) {
        console.log('upsert response:', err, res);
        if(err) {
            cb(err);
        }
        else {
            cb(err);
            //new NoticeJob(id, cat, cb);
        }
    });
}

Scraper.prototype.end = function(err) {
    if(err) {
        console.error('Error:', err, err.stack);
    }
    var next = this.start.bind(this);
    setTimeout(next, this.interval);
};
