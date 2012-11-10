var util = require('util'),
  fs = require("fs")
 jsdom = require('jsdom');

var jquery = fs.readFileSync("./jquery-1.7.2.min.js").toString();


/*
 * Regular expression that matches all blank spaces. Used for cleaning up HTML.
 */
var reg_space = /[\s\n\r\t ]+/g;

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
        callback(error, notice);
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
          coordinator: $('#MainUserControl_coordinatorsRows td.item', buyerInfoTable).html().replace(reg_space, ' '),
          website: $('a[href^="http"]:first', buyerInfoTable).attr('href') || null,
        };

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

// 7a94703d-8e78-46e7-924a-ea65ae52ea7c
// 26644a9c-e575-41fe-9487-c021e91e74b1
// 98558b11-b359-459d-a275-8958cfcdcd6d
getNotice('98558b11-b359-459d-a275-8958cfcdcd6d', function(error, notice) {
  console.log(util.inspect(notice || error, true, null, true));
});