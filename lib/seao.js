var util = require('util'),
 fs = require("fs")
 jsdom = require('jsdom'),
 exec = require('child_process').exec,
 url = require('url');

var jquery = fs.readFileSync("./jquery-1.7.2.min.js").toString();


/*
 * Regular expression that matches all blank spaces. Used for cleaning up HTML.
 */
var reg_space = /[\s\n\r\t ]+/g;

function getNoticesByCategory(categoryId, page, pageSize, callback) {
  var pageNumber = parseInt(page) || 1;
  var nbResult = parseInt(pageSize) || 100;
  var cachePath = "./" + [categoryId, nbResult, pageNumber].join('-')  + ".html";
  //var url = 'http://seao.ca/Recherche/avis_selectionnes_jour.aspx?PageNumber=' + pageNumber + '&CallingPage=4&SubCategoryCode=' + categoryId + '&NbResult=' + nbResult + '&SortOrder=1&SortBy=2';
  var noticesUrl = 'https://seao.ca/Recherche/avis_selectionnes_jour.aspx?SubCategoryCode=' + categoryId + '&callingPage=4&CatChoosen=1&NbResult=' + nbResult;
  if (typeof callback !== 'function') {
    throw new Error('Callback is not a function.');
  }
  if (pageNumber > 1) {
    noticesUrl += '&PageNumber=' + pageNumber;
    callback(new Error('Paging not supported.'), {page: pageNumber, total: 0, notices: []});
    return;
  }
  getNoticesByUrl(noticesUrl, function(error, results) {
    if (results) {
      results.page = pageNumber;
    }
    callback(error, results);
  });
}

function searchNotices(number, buyerName, buyerType, callback) {
  var filter = {
    'UCSearchAdvancePlus1_numberTextBox': number,
    'UCSearchAdvancePlus1_UCSearchAdvanceOtherCriteriaPlusA1_WorkProviderTextBox': buyerName,
    'UCSearchAdvancePlus1_UCSearchAdvanceOtherCriteriaPlusA1_mddCategory': buyerType
  };
  var filename = ['search', process.pid, (new Date()).getTime()].join('-');
  fs.writeFile('/tmp/' + filename + '.json', JSON.stringify(filter), function (error) {
    if (error) throw error;
    child = exec('phantomjs lib/seao-search.phantom.js /tmp/' + filename + '.html /tmp/' + filename + '.json',
      {timeout: 60000},
      function (error, stdout, stderr) {
        if (error !== null) {
          throw error;
        }
        if (fs.existsSync('/tmp/' + filename + '.html')) {
          getNoticesByUrl(fs.readFileSync('/tmp/' + filename + '.html'), callback);
        }
        else {
          callback(new Error(''), {total: 0, notices: []});
        }
      }
    );
  });

};

function getNoticesByUrl(noticesUrl, callback) {
  jsdom.env({
    html: noticesUrl,
    src: [jquery],
    done: function(errors, window) {
      if (errors) {
        callback(errors, {total: 0, notices: []});
      }
      else {
        var $ = window.jQuery;
        var total = parseInt($('#uCSearchResults1_PublishedOpportunityNumResultslbl').text()) || parseInt($('#UCSearchResults1_PublishedOpportunityNumResultslbl').text()) || 0;
        var results = {total: total, notices: []};
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
          }
          results.notices.push(notice);
        });
        callback(null, results);
      }
    }
  });
}

function getNotice(itemId, callback) {
  var cachePath = "./" + itemId + ".html",
    noticeUrl = 'https://seao.ca/OpportunityPublication/avisconsultes.aspx?ItemId=' + itemId;
  jsdom.env({
    html: fs.existsSync(cachePath) ? fs.readFileSync(cachePath).toString() : noticeUrl,
    src: [jquery],
    done: function(errors, window) {
      var notice = {
        url: noticeUrl,
        itemId: itemId
      };
      if (errors) {
        callback(errors, notice);
      }
      else {
        var $ = window.jQuery;
        $('*[id^="OpportunityIdentifier1_lbl"]').each(function() {
          var id = this.id.substring("OpportunityIdentifier1_lbl".length);
          if (id.substring(id.length - 4) === 'Info') {
            notice[id.substring(0, id.length - 4)] = $(this).html().replace(reg_space, ' ').trim();
          };
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
          notice.buyer.coordinator = coordinatorElement.html().replace(reg_space, ' ')
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

        notice.description = $('#MainUserControl_lbDescription').html();

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
        callback(null, notice);
      }
    }
  });
}

exports.getNotice = getNotice;
exports.getNoticesByCategory = getNoticesByCategory;
exports.getNoticesByUrl = getNoticesByUrl;
exports.searchNotices = searchNotices;