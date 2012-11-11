
var url = require('url');

var Job = require('./job.js');

function CategoryJob(id, cb) {
    var url = 'https://seao.ca/Recherche/avis_selectionnes_jour.aspx?SubCategoryCode=';
    url += id + '&callingPage=4&CatChoosen=1&NbResult=100';
    Job.call(this, url, cb);
    this.category = id;
}
module.exports = CategoryJob;
CategoryJob.prototype = Object.create(Job.prototype);

/*
 * Regular expression that matches all blank spaces. Used for cleaning up HTML.
 */
var reg_space = /[\s\n\r\t ]+/g;

CategoryJob.prototype.execute = function(window) {
    var $ = window.jQuery;
    var total = Number($('#UCSearchResults1_PublishedOpportunityNumResultslbl').text()) || 0;
    var results = {page: 1, total: total, notices: [], id: this.category};
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
      notice.information = {
        PublicationDate: data.eq(3).text()
      };
      results.notices.push(notice);
    });
    this.end(null, results);
};

