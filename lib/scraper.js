
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
    this.startTime = Date.now();
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
        console.log(' -- Going to scrape categories');
        if(err) {
            return scraper.end(err);
        }
        var catsJob = [];
        for(var i=0; i<catsToScrape.length; i++) {
            catsJob.push(scrapeCategory.bind(scraper, catsToScrape[i]));
        }
        async.series(catsJob, this);
    }, function(err, results) {
        console.log(' -- Going to check new notices');
        if(err) {
            return scraper.end(err);
        }
        var noticesJob = [];
        for(var i=0; i<results.length; i++) {
            if(results[i]) {
                var notices = results[i].notices;
                for(var j=0; j<notices.length; j++) {
                    var notice = notices[j];
                    if(noticesToScrape.indexOf(notice.itemId) === -1) {
                        noticesToScrape.push(notice.itemId);
                        noticesJob.push(checkNotice.bind(scraper, notice, noticesToScrape, results[i].id));
                        noticesToScrape.splice(0);//clear
                    }
                }
            }
        }
        async.series(noticesJob, this);
    }, function(err) {
        console.log(' -- Going to scrape new notices');
        async.series(noticesToScrape, this);
    }, function(err) {
        scraper.end(err);
    });
}

function scrapeCategory(id, cb) {
    new CategoryJob(id, cb);
}

function checkNotice(notice, toScrape, cat, cb) {
    notice.category = cat;
    var Notice = this.db.model('Notice');
    var scraper = this;
    Notice.findOne({
        itemId: notice.itemId
    }, function(err, noticeObj) {
        if(err) {
            console.error('Can\' get notice', notice.itemId, ':', err);
            cb(err);
        }
        else if(!noticeObj) {
            toScrape.push(scrapeNotice.bind(scraper, notice, cat));
            cb(null);
        }
        else {
            cb(null);
        }
    });
    //
}

function scrapeNotice(notice, cat, cb) {
    var Notice = this.db.model('Notice');
    console.log('Will scrape notice:', notice.itemId);
    new NoticeJob(notice.itemId, cat, function(err, notice) {
        if(err) {
            cb(err);
        }
        else {
            var no = new Notice(notice);
            no.save(cb);
        }
    });
}

Scraper.prototype.end = function(err) {
    console.log('Scraping completed in %d ms', Date.now()-this.startTime);
    if(err) {
        console.error('Error:', err, err.stack);
    }
    var next = this.start.bind(this);
    setTimeout(next, this.interval);
};
