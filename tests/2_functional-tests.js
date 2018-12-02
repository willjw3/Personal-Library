/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*
*/

var chaiHttp = require('chai-http');
var chai = require('chai');
var assert = chai.assert;
var server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', function() {

  /*
  * ----[EXAMPLE TEST]----
  * Each test should completely test the response of the API end-point including response status code!
  */
  test('#example Test GET /api/books', function(done){
     chai.request(server)
      .get('/api/books')
      .end(function(err, res){
        assert.equal(res.status, 200);
        assert.isArray(res.body, 'response should be an array');
        assert.property(res.body[0], 'commentcount', 'Books in array should contain commentcount');
        assert.property(res.body[0], 'title', 'Books in array should contain title');
        assert.property(res.body[0], '_id', 'Books in array should contain _id');
        done();
      });
  });
  /*
  * ----[END of EXAMPLE TEST]----
  */

  suite('Routing tests', function() {

    var testid;
    suite('POST /api/books with title => create book object/expect book object', function() {

      test('Test POST /api/books with title', function(done) {
        chai.request(server)
         .post('/api/books')
         .send({
           title: 'Great Title'
         })
         .end(function(err, res){
           assert.equal(res.status, 200);
           assert.property(res.body, '_id');
           assert.property(res.body, 'title');
           assert.property(res.body, 'comments');
           assert.equal(res.body.title, 'Great Title');
           assert.isArray(res.body.comments);
           assert.lengthOf(res.body.comments, 0);
           testid = res.body._id;
           done();
         });
      });

      test('Test POST /api/books with no title given', function(done) {
        chai.request(server)
         .post('/api/books')
         .send({
           title: ''
         })
         .end(function(err, res){
           assert.equal(res.status, 200);
           assert.equal(res.text, 'no book title given');
           done();
         });

      });

    });


    suite('GET /api/books => array of books', function(){

      test('Test GET /api/books',  function(done){
        chai.request(server)
         .get('/api/books')
         .query({})
         .end(function(err, res){
           assert.equal(res.status, 200);
           assert.isArray(res.body, 'response should be an array');
           assert.property(res.body[0], 'commentcount', 'Books in array should contain commentcount');
           assert.property(res.body[0], 'title', 'Books in array should contain title');
           assert.property(res.body[0], '_id', 'Books in array should contain _id');
           done();
         })
      });

    });


    suite('GET /api/books/[id] => book object with [id]', function(){

      test('Test GET /api/books/[id] with id not in db',  function(done){
        chai.request(server)
         .get('/api/books/5c03ba66e208f60059414442')
         .query({})
         .end(function(err, res){
           assert.equal(res.status, 200);
           assert.equal(res.type, 'text/html');
           assert.equal(res.text, 'no book exists');
           done();
         });
      });

      test('Test GET /api/books/[id] with valid id in db',  function(done){
        chai.request(server)
         .get('/api/books/'+testid)
         .query({})
         .end(function(err, res){
           assert.equal(res.status, 200);
           assert.isObject(res.body, 'response should be an object');
           assert.property(res.body, '_id');
           assert.property(res.body, 'title');
           assert.property(res.body, 'comments');
           assert.equal(res.body._id, testid);
           assert.equal(res.body.title, 'Great Title');
           done();
         });
      });

    });


    suite('POST /api/books/[id] => add comment/expect book object with id', function(){

      test('Test POST /api/books/[id] with comment', function(done){
        chai.request(server)
         .post('/api/books/'+testid)
         .send({comment: 'Good book, eh'})
         .end(function(err, res){
           assert.equal(res.status, 200);
           assert.isObject(res.body, 'response should be an object');
           assert.property(res.body, '_id');
           assert.property(res.body, 'title');
           assert.property(res.body, 'comments');
           assert.isAtLeast(res.body.comments.length, 1);
           assert.include(res.body.comments, 'Good book, eh');
           done();
         })
      });

    });

  });

});
