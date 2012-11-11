
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;

module.exports = new Schema({
    id: {type:String, index:true}
});
