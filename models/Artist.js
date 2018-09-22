const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const artistSchema = new Schema({
  name: String,
  genre: String,
  album: [
    {
      name: String,
      year: Number
    }
  ]
});

module.exports = mongoose.model('Artist', artistSchema);
