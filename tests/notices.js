var seao = require('../lib/seao'),
  util = require('util');

seao.getNotices('G15', 1, 10, function(error, results) {
 console.log(util.inspect(error || results, false, null, true));
});