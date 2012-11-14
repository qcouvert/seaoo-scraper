
var Job = require('./job.js');

function NoticeJob(db, id, cb) {
    var url = 'https://seao.ca/OpportunityPublication/avisconsultes.aspx?ItemId='+id;
    Job.call(this, url, cb);
    this.itemId = id;
    this.db = db;
}
module.exports = NoticeJob;
NoticeJob.prototype = Object.create(Job.prototype);

/*
 * Regular expression that matches all blank spaces. Used for cleaning up HTML.
 */
var reg_space = /[\s\n\r\t ]+/g;

NoticeJob.prototype.execute = function(window) {
    var notice = {
        url: this.url,
        itemId: this.itemId
    };
    var $ = window.jQuery;
    $('*[id^="OpportunityIdentifier1_lbl"]').each(function() {
      var id = this.id.substring("OpportunityIdentifier1_lbl".length);
      if (id.substring(id.length - 4) === 'Info') {
        notice[id.substring(0, id.length - 4)] = $(this).html().replace(reg_space, ' ').trim();
      }
    });
    notice.information = {};
    $('#MainUserControl_lbBlockInformation').parents('h2').next().find('td.item *[id]').each(function() {
      var id = this.id.replace(/(^MainUserControl_lbl?)|(TextValue$)/, '');
      notice.information[id] = $(this).html().replace(reg_space, ' ').trim();
    });

    var buyerInfoTable = $('#MainUserControl_lbBlockInformation_buyers').parents('h2').next();
    notice.buyer = {
      website: $('a[href^="http"]:first', buyerInfoTable).attr('href') || null
    };
    var coordinatorElement = $('#MainUserControl_coordinatorsRows td.item', buyerInfoTable);
    if (coordinatorElement.length) {
      notice.buyer.coordinator = coordinatorElement.html().replace(reg_space, ' ');
    }
    buyerInfoTable.find('td.item span[id]').each(function() {
      if (this.id) {
        var id = this.id.replace(/(^MainUserControl_lbl?)|(Textvalue$)/, '');
        notice.buyer[id] = $(this).html().trim();
      }
    });
    var unspscTable = $('#MainUserControl_dgUNSPSC');
    notice.unspsc = {};
    unspscTable.find('tr:not(tr:first-child)').each(function(){
      var row = $(this);
      notice.unspsc[row.find('td:first-child').text().trim()] = row.find('td:nth-child(2)').text().trim();
    });
    var categoryTable = $('#MainUserControl_dgCategory');
    notice.categories = {};
    categoryTable.find('tr:not(tr:first-child)').each(function(){
      var row = $(this);
      notice.categories[row.find('td:first-child').text().trim()] = row.find('td:nth-child(2)').text().trim();
    });

    notice.description = $('#MainUserControl_lbDescription').text().replace(reg_space, ' ').trim();

    var documentTable = $('#MainUserControl_pnlDocDistrib table').eq(0);
    if (documentTable.length) {
      notice.documents = [];
      $('tr:not(tr:first-child)', documentTable).each(function() {
        var data = $('td', this);
        var document = {
          title: data.eq(0).text(),
          description: data.eq(1).text(),
          language: data.eq(2).text(),
          pages: data.eq(4).text(),
          url: 'https://seao.ca' + data.eq(5).find('a').attr('href')
        };

        notice.documents.push(document);
      });
    }
    console.log(' - Just scraped notice:', notice);
    this.end(null, notice);
};
