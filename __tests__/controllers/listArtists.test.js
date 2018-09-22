const mongoose = require('mongoose');
const path = require('path');
const httpMocks = require('node-mocks-http');
const events = require('events');
const { list } = require('../../controllers/Artist');
const Artist = require('../../models/Artist');

require('dotenv').config({
  path: path.join(__dirname, '../../settings.env')
});

describe('Artist LIST Endpoint', () => {
  beforeAll(done => {
    mongoose.connect(
      process.env.TEST_DATABASE_CONN,
      { useNewUrlParser: true },
      done
    );
  });

  it('should retrieve a list of Artists from the database', done => {
    let artists = [
      { name: 'the beatles', genre: 'rock' },
      { name: 'the rolling stones', genre: 'rock' },
      { name: 'the bee gees', genre: 'disco' }
    ];

    Artist.create(artists, err => {
      if (err) {
        console.log(err, 'something went wrong');
      }

      const request = httpMocks.createRequest({
        method: 'GET',
        url: '/Artist'
      });

      const response = httpMocks.createResponse({
        eventEmitter: events.EventEmitter
      });

      list(request, response);

      response.on('end', () => {
        const listOfArtists = JSON.parse(response._getData());
        expect(listOfArtists.map(e => e.name)).toEqual(
          expect.arrayContaining([
            'the beatles',
            'the rolling stones',
            'the bee gees'
          ])
        );
        expect(listOfArtists).toHaveLength(3);
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
