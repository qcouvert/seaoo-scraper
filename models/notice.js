
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;

module.exports = new Schema({
    itemId: {type:String, index:true},
    No: {type:String, index:true},
    NoRef: {type:String, index:true},
    url: String,
    Title: String,
    information: {
        PublicationDate: String
    }
});