
var url = require('url');

var timezonejs = require('timezone-js');

var Job = require('./job.js');

function CategoryJob(db, id, cb) {
    var url = 'https://seao.ca/Recherche/avis_selectionnes_jour.aspx?SubCategoryCode=';
    url += id + '&callingPage=4&CatChoosen=1&NbResult=100';
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
        return this.end(err);
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
    Notice.find({
        itemId: Object.keys(results)
    }, compareNotices.bind(this, results));
};

function compareNotices(newNotices, err, oldNotices) {
    //
}

