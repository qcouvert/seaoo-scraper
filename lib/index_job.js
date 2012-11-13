
var url = require('url');

var async = require('async');

var Job = require('./job.js');

function IndexJob(db) {
    Job.call(this, 'Index', 'https://seao.ca/index_toutes.aspx');
    this.db = db;
}
module.exports = IndexJob;
IndexJob.prototype = Object.create(Job.prototype);

IndexJob.prototype.execute = function(err, window) {
    if(err) {
        return this.end(err, 'Error fetching category list');
    }
    var $ = this.jQuery = window.$;
    var Category = this.db.model('Category');
    var categories = $("tr:has('td[width=\"100%\"]'):has('.ligneBl'):not(:has(#UCOpportunityTotalList1_Label1))");
    var toSave = {};
    var name, link, id;
    for(var i=0; i<categories.length; i++) {
        var cat = $(categories[i]);
        var nb = Number(cat.find('.ligneBl2').text());
        if(nb) {
            name = cat.find('.ligneBl').text();
            link = cat.find('.ligneBl2 a').attr('href');
            id = url.parse(link, true).query.SubCategoryCode;
            toSave[id] = {
                slug: id,
                url: link,
                name: name
            };
        }
    }
    var job = this;
    Category.find({
        slug: Object.keys(toSave)
    }, function(err, categories) {
        if(err) {
            return job.end(err, 'Error finding existing categories');
        }
        var saveQueries = [];
        for(var i=0; i<categories.length; i++) {
            var cat = categories[i];
            var id = cat.slug;
            if(id in toSave && toSave[id].name != cat.name) {
                console.log('[%s] Update category name "%s" to "%s"', cat.slug, cat.name, toSave[id].name);
                cat.name = toSave[id].name;
                saveQueries.push(cat.save.bind(cat));
                delete toSave[id];
            }
        }
        var toInsert = [];
        for(var k in toSave) {
            console.log('[%s] Save new category "%s"', toSave[k].slug, toSave[k].name);
            toInsert.push(toSave[k]);
        }
        if(toInsert.length) {
            saveQueries.push(Category.create.bind(Category, toInsert));
        }
        if(saveQueries.length) {
            async.parallel(saveQueries, job.end.bind(job));
        }
        else {
            job.end(null);
        }
    });
};
