var assert = require('assert').strict;
var app = require('./index.js');
var request = require('supertest')(app);

describe('Load testing operations', function () {
  afterAll(function (done) {
    app.close();
    done();
  });

  test("should get a valid cart", function (done) {
    request.get(`/api/carts/777`)
      .end(function (err, res) {
        assert.strictEqual(res.status, 200);
        done();
      });
  });

  test("should error if cart id is not valid", function (done) {
    request.get(`/api/carts/0`)
      .end(function (err, res) {
        assert.strictEqual(res.status, 404);
        done();
      });
  });
});
