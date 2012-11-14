
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;

var Notice = module.exports = new Schema({
    itemId: {type:String, index:true},
    No: {type:String, index:true},
    NoRef: {type:String, index:true},
    url: String,
    Title: String,
    Status: String,
    description: String,
    publication: Date,
    closing: Date,
    information: {
        PublicationDate: String
    },
    categories: [String],
    creation: {type:Date, default:Date.now, index:true},
    update: {type:Date, index:true},
    tags: [String],
    complete: {type:Boolean, default:false},// ready to be served in results
    toScrape: {type:Boolean, default:true}, // marked to be scraped
    scraping: {type:Boolean, default:false} // currently being scraped
});

Notice.index({tags: 1});
Notice.index({categories: 1});

Notice.pre('save', function(next) {
    this.update = Date.now();
    next();
});
