const mongoose = require('mongoose');
const path = require('path');
const httpMocks = require('node-mocks-http');
const events = require('events');
const { postAlbum } = require('../../controllers/Artist');
const Artist = require('../../models/Artist');
const Album = require('../../models/Album');

require('dotenv').config({
  path: path.join(__dirname, '../../settings.env')
});

describe('POST album endpoint', () => {
  beforeAll(done => {
    mongoose.connect(
      process.env.TEST_DATABASE_CONN,
      done
    );
  });

  it('should create an album record when POST endpoint is called', done => {
    const artist = new Artist({ name: 'David Bowie', genre: 'Rock' });
    artist.save((err, artistCreated) => {
      if (err) {
        console.log(err, 'stuff stopped working');
      }

      const request = httpMocks.createRequest({
        method: 'POST',
        url: `/Artist/${artistCreated._id}/album`,
        params: {
          artistId: artistCreated._id
        },
        body: {
          name: 'Hunky Dory',
          year: 1971
        }
      });

      const response = httpMocks.createResponse({
        eventEmitter: events.EventEmitter
      });

      postAlbum(request, response);

      response.on('end', () => {
        const albumCreated = JSON.parse(response._getDate());
        expect(albumCreated.name).toEqual('Hunky Dory');
        expect(albumCreated.year).toEqual(1971);
        expect(albumCreated.artist._id).toEqual(artistCreated._id.toString());
        done();
      });
    });
  });
  afterEach(done => {
    Artist.collection.drop(artistDropErr => {
      Album.collection.drop(albumDropErr => {
        if (artistDropErr || albumDropErr) {
          console.log('Can not drop test collections');
        }
        done();
      });
    });
  });
  afterAll(() => {
    mongoose.connection.close();
  });
});
