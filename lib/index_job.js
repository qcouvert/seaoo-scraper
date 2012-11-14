
var url = require('url');

var async = require('async');
var ap = require('ap');

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
    var Category = this.db.model('Category');
    var s = Category.find({
        slug: {$in: Object.keys(toSave)}
    }).stream();
    s.on('data', ap([toSave], compareCategory));
    s.on('error', console.error.bind(console, 'Error streaming existing categories:'));
    s.on('close', addCategories.bind(this, toSave, Category));
};

function compareCategory(toSave, category) {
    var id = category.slug;
    if(id in toSave) {
        if(toSave[id].name != category.name) {
            var s = this;
            this.pause();
            console.log('[%s] Update category name "%s" to "%s"', category.slug, category.name, toSave[id].name);
            category.save(function(err) {
                if(err) {
                    console.error('Error saving category:', err);
                }
                s.resume();
            });
        }
    }
    delete toSave[id];
}

function addCategories(toSave, Category) {
    var toInsert = [];
    for(var k in toSave) {
        console.log('[%s] Save new category "%s"', toSave[k].slug, toSave[k].name);
        toInsert.push(toSave[k]);
    }
    if(toInsert.length) {
        Category.create(toInsert, this.end.bind(this));
    }
    else {
        this.end(null);
    }
}

