const mongoose = require('mongoose');
const path = require('path');
const httpMocks = require('node-mocks-http');
const events = require('events');
const { deleteArtist } = require('../../controllers/Artist');
const Artist = require('../../models/Artist');

require('dotenv').config({
  path: path.join(__dirname, '../../settings.env')
});

describe('DELETE Artist endpoint', () => {
  beforeAll(done => {
    mongoose.connect(
      process.env.TEST_DATABASE_CONN,
      done
    );
  });

  it('should delete an artist entry', done => {
    const artist = new Artist({ name: 'Stone Roses', genre: 'Britpop' });
    artist.save((err, artistCreated) => {
      if (err) {
        console.log(err, 'stuff stopped working');
      }

      const request = httpMocks.createRequest({
        method: 'DELETE',
        url: 'Artist/1234',
        params: {
          artistId: artistCreated._id
        }
      });

      const response = httpMocks.createResponse({
        eventEmitter: events.EventEmitter
      });

      deleteArtist(request, response);

      response.on('end', () => {
        Artist.findById(artistCreated._id, (err, noSuchArtist) => {
          expect(noSuchArtist).toBe(null);
          done();
        });
      });
    });
  });
});
