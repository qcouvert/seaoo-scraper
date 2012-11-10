
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
        var categories;// = $('#UCOpportunityTotalList1_Label1 + table');
        //console.log(categories);
        categories = $("tr:has('td[width=\"100%\"]'):has('.ligneBl'):not(:has(#UCOpportunityTotalList1_Label1))");
        console.log(categories.length);
        for(var i=0; i<categories.length; i++) {
            parseCategory.call(this, categories[i], i, categories);
        }
        this.end(null, this.results);
    }
    catch(e) {
        console.log('Error:', e);
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
        var u = url.parse(link, true);
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
