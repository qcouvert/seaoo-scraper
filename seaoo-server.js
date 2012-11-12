var connect = require('connect'),
  http = require('http'),
  router = require('flask-router')(),
  seao = require('./lib/seao');

router.get('/notice/<uuid:itemid>', function (req, res) {
  seao.getNotice(req.params.itemid, function(error, notice) {
    if (!error) {
      res.write(JSON.stringify(notice));
    }
    else {
      res.write(JSON.stringify({error: error}));
    }
    res.end();
  });
});
router.get('/notice', function(req, res) {
  if (typeof req.query.number !== 'undefined') {
    seao.searchNotices(req.query.number, req.query.buyer || null, req.query.buyerType || null, function(error, notices) {
      if (!error) {
        res.write(JSON.stringify(notices));
      }
      else {
        res.write(JSON.stringify({error: error}));
      }
      res.end();
    })
  }
  else if (typeof req.query.category !== 'undefined') {
   seao.getNoticesByCategory(req.query.category, 1, 100, function(error, notices) {
     if (!error) {
       res.write(JSON.stringify(notices));
     }
     else {
       res.write(JSON.stringify({error: error}));
     }
     res.end();
   })
  }
  else {
    res.write(JSON.stringify({error: 'Missing required filter.'}));
    res.end();
  }
});

var app = connect()
  .use(connect.query())
  .use(router.route);

http.createServer(app).listen(8080);