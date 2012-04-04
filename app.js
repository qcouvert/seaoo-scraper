
/**
 * Module dependencies.
 */

var express = require('express')
  , jsdom = require('jsdom')
  , request = require('request')
  , url = require('url')
  , routes = require('./routes');

var app = module.exports = express.createServer();

// Configuration

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
  app.use(express.errorHandler());
});

// Routes
app.get('/', function(req, res){
  var self = this;
  self.items = [];

  jsdom.env({
    html: 'https://seao.ca/Recherche/avis_selectionnes_jour.aspx?SubCategoryCode=S4&callingPage=4&CatChoosen=1&NbResult=100',
    scripts: ['http://code.jquery.com/jquery-1.7.2.min.js'],
    done: function(errors, window) {
      var $ = window.jQuery,
          $body = $('body'),
          $offers = $("td.contenu table table[id=''] tr[id='']");


      $offers.each(function(i, item) {
        var $td = $(item).find('td').eq(1),
            name = $td.find('span.titreAvis').text().trim(),
            link = $td.find('a')[0].href,
            annoncer = $td.find('b');

        if(!filterOffer(name)) return true

        self.items.push({
          title: name,
          url: link,
          client: annoncer
        });
      });

      res.render('index', {
        title: $('title').text(),
        offers: self.items
      });
    }
  });
});

function filterOffer(title) {
  var valid = true;

  if(title.indexOf('Téléphonie') != -1) valid = false;

  return valid
}

app.listen(3000);
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
