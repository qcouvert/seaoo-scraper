
var Job = require('./job.js');

function IndexJob(cb) {
    Job.call(this, 'https://seao.ca/index_toutes.aspx', cb);
    console.log('Start fetching categories...');
}
module.exports = IndexJob;
IndexJob.prototype = Object.create(Job.prototype);

IndexJob.prototype.execute = function(window) {
    console.log('Execute scraping of index');
    this.end(null, []);
};
