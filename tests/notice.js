var seao = require('../lib/seao'),
    util = require('util');

// 7a94703d-8e78-46e7-924a-ea65ae52ea7c
// 26644a9c-e575-41fe-9487-c021e91e74b1
// 98558b11-b359-459d-a275-8958cfcdcd6d
seao.getNotice('a3461598-3fde-4587-a35c-dbe8058792a1', function(error, notice) {
  console.log(util.inspect(notice || error, false, null, true));
});

