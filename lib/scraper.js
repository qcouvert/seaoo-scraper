
var jsdom = require('jsdom');
var Step = require('step');

var IndexJob = require('./index_job.js');
var CategoryJob = require('./category_job.js');

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
            Category.update({
                id: results[i].id
            }, {
                id: results[i].id,
                name: results[i].name
            }, {
                upsert: true
            }, group());
        }
    }, function(err, res) {
        if(err) {
            return scraper.end(err);
        }
        for(var i=0; i<results.length; i++) {
            new CategoryJob(results[i].id, scraper.db, this.parallel());
        }
    }, function(err, res) {
        //
    });
}

Scraper.prototype.end = function(err) {
    if(err) {
        console.error('Error:', err);
    }
    var next = this.start.bind(this);
    setTimeout(next, this.interval);
};

//Create dom environment based on SEAO url
function extractSeaoData() {
  jsdom.env({
    html: 'https://seao.ca/Recherche/avis_selectionnes_jour.aspx?SubCategoryCode=S4&ColumnAction=1&callingPage=4&CatChoosen=1&NbResult=100',
    scripts: ['http://code.jquery.com/jquery-1.7.2.min.js'],
    done: function(errors, window) {
      var $ = window.jQuery,
          $offers = $("span.titreAvis"),
          offers_length = $offers.length,
          processed_length = 0;

      db.serialize()

      //Loop on offers to extract that precious data
      $offers.each(function(i, item) {

        var $td = $(item).parents('td:first'),
            name = $(item).text().trim(),
            link = $td.find('a')[0].href,
            annoncer = $td.find('b').text().trim(),
            hash = crypto.createHash('sha1').update(link).digest('hex');

        db.get('SELECT 1 FROM scrapes WHERE hash = ?', [hash], function(err, result) {
          if(!result) {
            db.run('INSERT INTO scrapes (hash) VALUES (?)', [hash]);
            dataset.add(annoncer, name, link);
          }
          if(++processed_length == offers_length) {
            db.close();
            if(dataset.hasData()) sendMail();
          }
        });

      });

    }
  });
}