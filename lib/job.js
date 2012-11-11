
var fs = require('fs');
var path = require('path');
var EventEmitter = require('events').EventEmitter;

var jsdom = require('jsdom');



var jquery = fs.readFileSync(path.join(__dirname, '..', 'jquery-1.8.2.min.js')).toString();

function Job(url, cb) {
    EventEmitter.call(this);
    this.url = url;
    this.cb = cb;
    jsdom.env({
        html: url,
        src: [jquery],
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
