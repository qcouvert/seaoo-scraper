
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;

module.exports = new Schema({
    slug: {type:String, index:true},
    url: String,
    
});
