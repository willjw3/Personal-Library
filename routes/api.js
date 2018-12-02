/*
*
*
*       Complete the API routing below
*
*
*/

'use strict';

var expect = require('chai').expect;
var MongoClient = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectID;
//require('dotenv').config();
const MONGODB_CONNECTION_STRING = process.env.DB;

//Example connection: MongoClient.connect(MONGODB_CONNECTION_STRING, function(err, db) {});

module.exports = function (app) {

  app.route('/api/books')
    .get(function (req, res){
      //response will be array of book objects
      //json res format: [{"_id": bookid, "title": book_title, "commentcount": num_of_comments },...]
      MongoClient.connect(MONGODB_CONNECTION_STRING, { useNewUrlParser: true }, function(err, client) {
        if (!err) {
          console.log('Database connection established...');
        }
        var db = client.db('infosecqa');
        db.collection('books').find({}).toArray(function(err, result) {
          if (err) {console.error(err);}
          var booklist = result.map((item) => {
            return {"_id": item._id, "title": item.title, "commentcount": item.comments.length }
          })
          //console.log(booklist);
          res.send(booklist);
          client.close();
        });
      });
    })

    .post(function (req, res){
      var title = req.body.title;
      //response will contain new book object including atleast _id and title
      //console.log(title);
      if (!title) {return res.send('no book title given');}
      var book = {
        title: title,
        comments: []
      }
      MongoClient.connect(MONGODB_CONNECTION_STRING, { useNewUrlParser: true }, function(err, client) {
        if (!err) {
          console.log('Database connection established...');
        }
        var db = client.db('infosecqa');
        db.collection('books').insertOne(book, (err, result) => {
          if (err) {console.error(err);}
          console.log('Document successfully inserted');
          client.close();
          res.json({
            "_id": result.insertedId,
            "title": title,
            "comments": []
          });
        });
      });
      return;
    })

    .delete(function(req, res){
      //if successful response will be 'complete delete successful'
      MongoClient.connect(MONGODB_CONNECTION_STRING, { useNewUrlParser: true }, function(err, client) {
        if (!err) {
          console.log('Database connection established...');
        }
        var db = client.db('infosecqa');
        var bookQuery = {};
        db.collection('books').deleteMany(bookQuery, function(err, doc) {
          if (err) {console.error(err);}
          client.close();
        });
        return res.send('complete delete successful');
      });
      return;
    });



  app.route('/api/books/:id')
    .get(function (req, res){
      var bookid = req.params.id;
      //json res format: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]}
      MongoClient.connect(MONGODB_CONNECTION_STRING, { useNewUrlParser: true }, function(err, client) {
        if (!err) {
          console.log('Database connection established...');
        }
        var db = client.db('infosecqa');
        try {
          var eyedee = new ObjectId(bookid);
        }
        catch(err) {
          console.log('error message: ' + err.message);
          return res.send(err.message);
        }

        var bookQuery = {_id: eyedee};
        //console.log(bookQuery);
        db.collection('books').findOne(bookQuery, function(err, result) {
          if (err) {console.log(err);}
          if (!result) {
            console.log("No document with that _id found in database");
            return res.send('no book exists');
          }
          res.send(result);
          client.close();
        });
      });
      return;
    })

    .post(function(req, res){
      var bookid = req.params.id;
      var comment = req.body.comment;
      //console.log(bookid);
      //console.log(comment);
      //json res format same as .get
      MongoClient.connect(MONGODB_CONNECTION_STRING, { useNewUrlParser: true }, (err, client) => {
        if (!err) {
          console.log('Database connection established...');
        }
        var db = client.db('infosecqa');
        try {
          var eyedee = new ObjectId(bookid);
        }
        catch(err) {
          console.log('error message: ' + err.message);
          return res.send(err.message);
        }

        var bookQuery = {_id: eyedee};
        //console.log(bookQuery);
        db.collection('books').findOne(bookQuery, (err, doc) => {
          if (err) {console.error(err);}
          doc.comments.push(comment);
          var newComments = {$set: {comments: doc.comments}};
          db.collection('books').updateOne(bookQuery, newComments, (err, result) => {
            if (err) {console.error(err);}
            console.log('Comment added');
            client.close();
          });
          //console.log(doc.comments);
          res.send(doc);
        });
      });
      return;
    })

    .delete(function(req, res){
      var bookid = req.params.id;
      //if successful response will be 'delete successful'
      MongoClient.connect(MONGODB_CONNECTION_STRING, { useNewUrlParser: true }, function(err, client) {
        if (!err) {
          console.log('Database connection established...');
        }
        var db = client.db('infosecqa');
        try {
          var eyedee = new ObjectId(bookid);
        }
        catch(err) {
          console.log('error message: ' + err.message);
          return res.send(err.message);
        }

        var bookQuery = {_id: eyedee};
        //console.log(bookQuery);
        db.collection('books').find(bookQuery).toArray((err, result) => {
          if (err) {console.log(err.message);}
          if (result.length === 0) {
            console.log("No document with that _id found in database");
            return res.send('no book exists');
          }
          else {
            db.collection('books').deleteOne(bookQuery, (err, obj) => {
              if (err) {console.log(err.message);
                return res.send('could not delete '+input._id);
              }
              console.log('1 document deleted');
              res.send('delete successful');
              client.close();
            });
          }
        });
      });
      return;
    });

};