
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;

module.exports = new Schema({
    name: String,
    id: {type: String, index: true}
});
