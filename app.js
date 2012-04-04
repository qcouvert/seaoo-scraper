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
        mailContent = '<ul>';

    //Loop on offers to extract that precious data
    $offers.each(function(i, item) {
      var $td = $(item).find('td').eq(1),
          name = $td.find('span.titreAvis').text().trim(),
          link = $td.find('a')[0].href,
          annoncer = $td.find('b').text().trim();

      //Skip to next offer if it doesn't match criterias
      if(!filterOffer(name)) return true

      mailContent += '<li>' + annoncer + ' - <a href="' + link + '">' + name + '</a></li>';
    });

    mailContent += "</ul>";

    //Send tha mail
    sendMail({
      from: "leo.renaud@hooktstudios.com",
      to: "leo.renaud@hooktstudios.com",
      subject: "Hookt Studios' SEAO Daily Scrape",
      text: "Y U NO HTML?",
      html: mailContent
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

function filterOffer(title) {
  return (title.indexOf('Téléphonie') != -1) ? false : true;
}

console.log('Running!')