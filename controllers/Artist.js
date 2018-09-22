const Artist = require('../models/Artist');

exports.post = (req, res) => {
  const artist = new Artist({ name: req.body.name, genre: req.body.genre });
  artist.save((err, artistCreated) => {
    res.json(artistCreated);
  });
};

exports.list = (req, res) => {
  Artist.find({}, (err, artists) => {
    if (err) {
      res.join('Something went wrong');
    }
    res.json(artists);
  });
};

exports.get = (req, res) => {
  Artist.findById(req.params.artistId, (err, artist) => {
    if (err) {
      res.json('Something went wrong');
    }
    res.json(artist);
  });
};

exports.put = (req, res) => {
  Artist.findById(req.params.artistId, (err, artist) => {
    if (err) {
      res.json('something went wrong');
    }

    artist.set({ name: req.body.name });
    artist.set({ name: req.body.genre });

    artist.save((updateErr, artistUpdated) => {
      if (updateErr) {
        res.json('could not update');
      }

      res.json(artistUpdated);
    });
  });
};
