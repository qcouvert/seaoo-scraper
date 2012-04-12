//Dependencies
var jsdom = require('jsdom'),
    nodemailer = require('nodemailer');

//Create dom environment based on SEAO url
jsdom.env({
  html: 'https://seao.ca/Recherche/avis_selectionnes_jour.aspx?SubCategoryCode=S4&ColumnAction=1&callingPage=4&CatChoosen=1&NbResult=100',
  scripts: ['http://code.jquery.com/jquery-1.7.2.min.js'],
  done: function(errors, window) {
    var $ = window.jQuery,
        $offers = $("td.contenu table table[id=''] tr[id='']"),
        dataset = new SEAODataset();

    //Loop on offers to extract that precious data
    $offers.each(function(i, item) {
      var $td = $(item).find('td').eq(1),
          name = $td.find('span.titreAvis').text().trim(),
          link = $td.find('a')[0].href,
          annoncer = $td.find('b').text().trim();
      dataset.add(annoncer, name, link);
    });

    console.log(dataset.asText());

    //Send tha mail
    sendMail({
      from: "jimmy.bourassa@hooktstudios.com",
      to: "jimmy.bourassa@hooktstudios.com",
      subject: "Hookt Studios' SEAO Daily Scrape",
      text: dataset.asText(),
      html: dataset.asHtml()
    });
  }
});

function sendMail(options) {
  var smtpTransport = nodemailer.createTransport("Sendmail", "/usr/sbin/sendmail");

  smtpTransport.sendMail(options, function(error, response){
      if(error) console.log(error);
      else console.log("Message sent: " + response.message);
      smtpTransport.close(); // shut down the connection pool, no more messages
  });
}

function SEAODataset() {
  this.data = [];
}

SEAODataset.prototype = {
  add: function(annoncer, name, url) {
    if(!this._skip(name)) {
      this.data.push({ annoncer: annoncer, name: name, url: url});
    }
  },
  asText: function() {
    return this.data.map(function(item) {
      return item.annoncer + ' - ' + item.name + '\n' + item.url;
    }).join('\n\n');
  },
  asHtml: function() {
    var list = this.data.map(function(item) {
      return '<li>' + itemannoncer + ' - <a href="' + link + '">' + name + '</a></li>';
    }).join('\n');

    return '<ul>\n' + list + '</ul>';
  },
  _skip: function(name) {
    return (name.indexOf('Téléphonie') == -1) ? false : true;
  }
}


console.log('Running!')
