
var jsdom = require('jsdom');

var EventEmitter = require('events').EventEmitter;

function Job(url, cb) {
    EventEmitter.call(this);
    this.url = url;
    this.cb = cb;
    jsdom.env({
        html: url,
        scripts: [
            'https://ajax.googleapis.com/ajax/libs/jquery/1.8.2/jquery.min.js'
        ],
        done: execute.bind(this)
    });
}
module.exports = Job;
Job.prototype = Object.create(EventEmitter.prototype);

function execute(err, window) {
    if(err) {
        this.cb(err);
    }
    else {
        this.execute(window);
    }
}

Job.prototype.end = function(err, result) {
    this.cb(err, result);
};
