
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;

module.exports = new Schema({
    name: String,
    slug: {type: String, index:true},
    update: {type: Date, default:0, index:true},
    scraping: {type: Boolean, default:false}
});
