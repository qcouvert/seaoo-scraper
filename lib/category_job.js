
var url = require('url');

var timezonejs = require('timezone-js');
var async = require('async');

var Job = require('./job.js');

function CategoryJob(db, id, page, cb) {
    var url = 'https://seao.ca/Recherche/avis_selectionnes_jour.aspx?SubCategoryCode=';
    url += id + '&NbResult=100&PageNumber=' + (page || '1');
    Job.call(this, 'Category '+id, url, cb);
    this.db = db;
    this.category = id;
}
module.exports = CategoryJob;
CategoryJob.prototype = Object.create(Job.prototype);

/*
 * Regular expression that matches all blank spaces. Used for cleaning up HTML.
 */
var reg_space = /[\s\n\r\t ]+/g;
var reg_date = /(\d{4}-\d?\d-\d?\d) (\d?\d)h(\d?\d)?/;

CategoryJob.prototype.execute = function(err, window) {
    if(err) {
        return this.end(err, 'Error fetching notices list');
    }
    var $ = window.jQuery;
    var results = {};
    $('#tblResults tr:not(:first-child)').each(function(){
        var data = $('td', this);
        var notice = {
            //url, No, NoRef, Status, Title
            url: data.eq(1).find('a:first-child').attr('href'),
            No: data.eq(1).find('a:first-child').text().replace(reg_space, ' ').trim(),
            Title: data.eq(1).find('.titreAvis').text().replace(reg_space, ' ').trim(),
            Status: data.eq(2).text().replace(reg_space, ' ').trim()
        };
        var matches =  data.eq(1).text().match(/\/\s([0-9]*)\s/);
        if (matches) {
            notice.NoRef = matches[1];
        }
        notice.itemId = url.parse(notice.url, true).query.ItemId;
        notice.url = 'https://seao.ca/OpportunityPublication/avisconsultes.aspx?ItemId=' + notice.itemId;
        var d = reg_date.exec(data.eq(3).text());
        if(d) {
            notice.publication = new timezonejs.Date(d[1]+' '+d[2]+':'+(d[3] || '00')).getTime();
        }
        d = reg_date.exec(data.eq(4).text());
        if(d) {
            notice.closing = new timezonejs.Date(d[1]+' '+d[2]+':'+(d[3] || '00')).getTime();
        }
        notice.information = {
            PublicationDate: data.eq(3).text()
        };
        results[notice.itemId] = notice;
    });
    var Notice = this.db.model('Notice');
    console.log('%d notices to check', Object.keys(results).length);
    Notice.find({
        itemId: {$in: Object.keys(results)}
    }, compareNotices.bind(this, results));
};

function compareNotices(toSave, err, notices) {
    if(err) {
        return this.end(err, 'Error finding existing notices');
    }
    console.log('Found %d existing notices', notices.length);
    var saveQueries = [];
    for(var i=0; i<notices.length; i++) {
        var notice = notices[i];
        var id = notice.itemId;
        /*if(id in toSave && toSave[id].name != cat.name) {
            console.log('[%s] Update notice "%s" to "%s"', notice.itemId, cat.name, toSave[id].name);
            cat.name = toSave[id].name;
            saveQueries.push(cat.save.bind(cat));
        }//*/
        delete toSave[id];
    }
    var toInsert = [];
    for(var k in toSave) {
        console.log('[%s] Save new notice "%s"', toSave[k].itemId, toSave[k].Title);
        toInsert.push(toSave[k]);
    }
    console.log('Will insert %d new notices', toInsert.length);
    if(toInsert.length) {
        var Notice = this.db.model('Notice');
        saveQueries.push(Notice.create.bind(Notice, toInsert));
    }
    if(saveQueries.length) {
        async.parallel(saveQueries, this.end.bind(this));
    }
    else {
        this.end(null);
    }
}

