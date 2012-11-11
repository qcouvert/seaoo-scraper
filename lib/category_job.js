
var Job = require('./job.js');

function CategoryJob(id, db, cb) {
    var url = '';
    Job.call(this, url);
}
module.exports = CategoryJob;
CategoryJob.prototype = Object.create(Job.prototype);
