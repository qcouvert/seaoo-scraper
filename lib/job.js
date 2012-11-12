
var fs = require('fs');
var path = require('path');
var EventEmitter = require('events').EventEmitter;

var jsdom = require('jsdom');



var jquery = fs.readFileSync(path.join(__dirname, '..', 'jquery-1.8.2.min.js')).toString();

function Job(label, url, cb) {
    EventEmitter.call(this);
    this.label = label;
    this.url = url;
    this.cb = cb;
    this.startTime = Date.now();
    jsdom.env({
        html: url,
        src: [jquery],
        done: execute.bind(this)
    });
}
module.exports = Job;
Job.prototype = Object.create(EventEmitter.prototype);

function execute(err, window) {
    try {
        this.execute(err, window);
    }
    catch(e) {
        this.end(e);
    }
}

Job.prototype.end = function(err, result) {
    if(err && typeof result == 'string') {
        console.error(result+':', err, err.stack);
    }
    console.log('Executed fetch of %s in %d ms', this.label, Date.now()-this.startTime);
    if(typeof this.cb == 'function') {
        this.cb(err, result);
    }
};
