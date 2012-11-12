var seao = require('../lib/seao'),
  util = require('util');

seao.searchNotices('10042', 'Laval', 4, function(error, results) {
  console.log(util.inspect(results || error, false, null, true));
});