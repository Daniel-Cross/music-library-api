const mongoose = require('mongoose');
const path = require('path');
const httpMocks = require('node-mocks-http');
const events = require('events');
const { getAlbum } = require('../../controllers/Album');
const Album = require('../../models/Album');

require('dotenv').config({
  path: path.join(__dirname, '../../settings.env')
});

describe('Album GET Endpoint', () => {
  beforeAll(done => {
    mongoose.connect(
      process.env.TEST_DATABASE_CONN,
      { useNewUrlParser: true },
      done
    );
  });

  it('should retrieve an artists albums', done => {
    const artist = new Artist({ name: 'Kings of Leon', genre: 'Indie' });
    artist.save((err, artistCreated) => {
      if (err) {
        console.log(err, 'error saving artist');
      }

      const albums = [
        { name: 'Aha, Shake, Heartbreak', year: 2004 },
        { name: 'Only by the Night', year: 2008 }
      ];

      Album.insertMany(albums, (albumErr, albumsCreated) => {
        if (albumErr) {
          console.log(err, 'error inserting albums');
        }

        const request = httpMocks.createRequest({
          method: 'GET',
          url: `Artist/${artistCreated._id}/album`,
          params: {
            artistId: artistCreated._id.toString()
          }
        });

        const response = httpMocks.createResponse({
          eventEmitter: events.EventEmitter
        });

        getAlbum(request, response);

        response.on('end', () => {
          const albumsFound = response._getData();
          expect(albumsFound).toEqual(JSON.stringify(albumsCreated));
          done();
        });
      });
    });
  });

  afterEach(done => {
    Artist.collection.drop(e => {
      if (e) {
        console.log(e);
      }
      Album.collection.drop(e => {
        if (e) {
          console.log(e);
        }
        done();
      });
    });
  });

  afterAll(() => {
    mongoose.connection.close();
  });
});
