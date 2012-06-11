//Dependencies
var jsdom = require('jsdom'),
    nodemailer = require('nodemailer'),
    sqlite3 = require('sqlite3').verbose(),
    crypto = require('crypto'),
    seao = require('./seao.js'),
    dataset = new seao.Dataset(),
    db;


function main() {
  createDb();
}

function createDb() {
  db = new sqlite3.Database('cache.sqlite3', createTable);
}

function createTable() {
  db.run("CREATE TABLE IF NOT EXISTS scrapes (" +
         "hash varchar(40) PRIMARY KEY, " +
         "created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP)", extractSeaoData);

}

//Create dom environment based on SEAO url
function extractSeaoData() {
  jsdom.env({
    html: 'https://seao.ca/Recherche/avis_selectionnes_jour.aspx?SubCategoryCode=S4&ColumnAction=1&callingPage=4&CatChoosen=1&NbResult=100',
    scripts: ['http://code.jquery.com/jquery-1.7.2.min.js'],
    done: function(errors, window) {
      var $ = window.jQuery,
          $offers = $("td.contenu table table[id=''] tr[id='']"),
          offers_length = $offers.length,
          processed_length = 0;

      db.serialize()

      //Loop on offers to extract that precious data
      $offers.each(function(i, item) {

        var $td = $(item).find('td').eq(1),
            name = $td.find('span.titreAvis').text().trim(),
            link = $td.find('a')[0].href,
            annoncer = $td.find('b').text().trim(),
            hash = crypto.createHash('sha1').update(link).digest('hex');

        db.get('SELECT 1 FROM scrapes WHERE hash = ?', [hash], function(err, result) {
          console.log(link);
          console.log(hash);
          if(!result) {
            db.run('INSERT INTO scrapes (hash) VALUES (?)', [hash]);
            dataset.add(annoncer, name, link);
          }
          if(++processed_length == offers_length) {
            db.close();
            // if(dataset.hasData()) sendMail();
          }
        });

      });

    }
  });
}

function sendMail() {
  var options = {
    from: "admin@hooktstudios.com",
    to: "info@hooktstudios.com",
    subject: "Hookt Studios' SEAO Scrape",
    text: dataset.asText(),
    html: dataset.asHtml()
  }
  console.log(dataset);
  var smtpTransport = nodemailer.createTransport("Sendmail", "/usr/sbin/sendmail");

  //smtpTransport.sendMail(options, function(error, response){
      //if(error) console.log(error);
      //else console.log("Message sent: " + response.message);
      //smtpTransport.close(); // shut down the connection pool, no more messages
  //});
}


main();

console.log('Running!')
