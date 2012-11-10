function Dataset() {
  this.data = [];
}

Dataset.prototype = {
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
      return '<li>' + item.annoncer + ' - <a href="' + item.url + '">' + item.name + '</a></li>';
    }).join('\n');

    return '<ul>\n' + list + '</ul>';
  },
  _skip: function(name) {
    return (name.indexOf('Téléphonie') == -1) ? false : true;
  },
  hasData: function() {
    return this.data.length != 0;
  }
}

exports.Dataset = Dataset;
