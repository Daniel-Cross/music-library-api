const mongoose = require('mongoose');
const path = require('path');
const httpMocks = require('node-mocks-http');
const events = require('events');
const { put } = require('../../controllers/Artist');
const Artist = require('../../models/Artist');

require('dotenv').config({
  path: path.join(__dirname, '../../settings.env')
});

describe('PUT Artist endpoint', () => {
  beforeAll(done => {
    mongoose.connect(
      process.env.TEST_DATABASE_CONN,
      done
    );
  });

  it('should update an artist record when PUT endpoint is called', done => {
    const artist = new Artist({ name: 'Oasis', genre: 'Rock' });
    artist.save((err, artistCreated) => {
      if (err) {
        console.log(err, 'stuff stopped working');
      }
      const request = httpMocks.createRequest({
        method: 'PUT',
        url: 'Artist/1234',
        params: {
          artistId: artistCreated._id
        },
        body: {
          name: 'Oasis',
          genre: 'Britpop',
          album: [
            {
              name: 'Definitely, Maybe',
              year: 1994
            }
          ]
        }
      });

      const response = httpMocks.createResponse({
        eventEmitter: events.EventEmitter
      });

      put(request, response);

      response.on('end', () => {
        const updatedArtist = JSON.parse(response._getData());
        expect(updatedArtist).toEqual({
          __v: 0,
          _id: artistCreated._id.toString(),
          name: 'Oasis',
          genre: 'Britpop',
          album: [{ name: 'Definitely Maybe', year: 1994 }]
        });
        done();
      });
    });
  });

  afterEach(done => {
    Artist.collection.drop(e => {
      if (e) {
        console.log(e);
      }
      done();
    });
  });

  afterAll(() => {
    mongoose.connection.close();
  });
});
