
var url = require('url');

var Job = require('./job.js');

function IndexJob(cb) {
    Job.call(this, 'https://seao.ca/index_toutes.aspx', cb);
    this.results = [];
    this.jQuery = null;
    console.log('Start fetching categories...');
}
module.exports = IndexJob;
IndexJob.prototype = Object.create(Job.prototype);

IndexJob.prototype.execute = function(window) {
    console.log('Execute scraping of index');
    try {
        var $ = this.jQuery = window.$;
        var categories = $('#UCOpportunityTotalList1_Label1 + table').find("tr:has('td[width=\"100%\"]')");
        categories.forEach(parseCategory, this);
        this.end(null, this.results);
    }
    catch(e) {
        ths.end(e, []);
    }
};

function parseCategory(v, i, a) {
    var $ = this.jQuery;
    var cat = $(v);
    var name = cat.find('.ligneBl').text();
    var nb = Number(cat.find('.ligneBl2').text());
    var link, id;
    if(nb) {
        link = cat.find('.ligneBl2 a')[0].href;
        var u = url.parse(link);
        id = u.query.SubCategoryCode;
    }
    console.log('Found category:', name, nb, link, id);
    this.results.push({
        name: name,
        count: nb,
        url: link,
        id: id
    });
}
