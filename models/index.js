
module.exports = function(dataDB, subscribeDB) {
    dataDB.model('Category', require('./category.js'));
    dataDB.model('Notice', require('./notice.js'));
};
