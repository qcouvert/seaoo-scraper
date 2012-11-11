
module.exports = function(db) {
    db.model('Category', require('./category.js'));
    db.model('Notice', require('./notice.js'));
};
