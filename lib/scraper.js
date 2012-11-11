
var jsdom = require('jsdom');
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
            }
        }
    }, function(err, res) {
        if(err) {
            return scraper.end(err);
        }
        for(var i=0; i<results.length; i++) {
            if(results[i].id) {
                new CategoryJob(results[i].id, this.parallel());
            }
        }
    }, getNotices.bind(this));
}

function getNotices(err, results) {
    console.log('getNotices:', arguments);
    this.end(err);
}

Scraper.prototype.end = function(err) {
    if(err) {
        console.error('Error:', err, err.stack);
    }
    var next = this.start.bind(this);
    setTimeout(next, this.interval);
};
