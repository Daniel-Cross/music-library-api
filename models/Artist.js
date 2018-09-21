const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const artistsSchema = new Schema({
  name: String,
  genre: String
});

module.exports = mongoose.model('Artist', artistsSchema);
