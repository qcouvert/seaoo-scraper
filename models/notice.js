
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
    information: {
        PublicationDate: String
    },
    creation: {type:Date, default:Date.now},
    update: Date,
    tags: [String]
});

Notice.index({tags: 1});

Notice.pre('save', function(next) {
    this.update = Date.now();
    next();
});
