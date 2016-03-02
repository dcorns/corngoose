/**
 * Created by dcorns on 11/25/14.
 */
'use strict';
var mongoClient = require('mongodb').MongoClient;
var ObjectID = require('mongodb').ObjectID;
var procE = process.env,
  mongoUri,
  db;
module.exports = (function () {

  return{
    startDB: function(dbPath){
      setDbPath(dbPath);
        dbConnect(mongoUri, function(err, dbin){
          if (err){
            console.log('Failed to connect to ' + mongoUri);
            console.error(err);
            throw err;
          }
          db = dbin;
          console.log('Connected to '+ mongoUri + '.');
        });
    },
    showDbPath: function(){
      return mongoUri;
    },
    dbDisConnect: function(cb){
      db.close(function(){
        return cb(null, 'Database connection closed');
      });
    },
    getCollection: function(collectionName, cb){
        db.collection(collectionName).find({}).toArray(function (err, collection) {
          if (err){
            return cb(err, null);
          }
          return cb(null, collection);
        });
    },
    dbDocReplace: function(doc, collectionName, cb){
        var id = ObjectID.createFromHexString(doc._id.toString());
        delete doc._id;
        id = {'_id': id};
        db.collection(collectionName).update(id, doc, function(err, updated) {
          if (err) return cb(err, null);
          return cb(null, updated);
        });
    },
    dbDocFind: function(queryObj, collectionName, cb){
        if(queryObj._id) queryObj._id = BSON.ObjectID.createFromHexString(queryObj._id);
          db.collection(collectionName).find(queryObj).toArray(function(err, doc){
            if (err) return cb(err, null);
            return cb(null, doc);
          });
    },
    dbDocUpdate: function(queryObj, updateObject, collectionName, cb){
      this.dbDocFind(queryObj, collectionName, function(err, doc){
        if(err){
          return cb(err, null);
        }
        if(updateObject._id) delete updateObject._id;
        var updateObj = {$set: updateObject};
        db.collection(collectionName).update(queryObj, updateObj, function(err, result){
          if(err){
            return cb(err, null);
          }
          return cb(null, result);
        });
      });
    },
    dbDocInsert: function(keyObj, docData, collectionName, cb){
      this.dbDocFind(keyObj, collectionName, function(err, docAry){
        if(err){
          return cb(err, null);
        }
        if(docAry[0]){
          return cb('Key Object already exists in database', null);
        }
        db.collection(collectionName).insert(docData, {w:1}, function(err, insertDocArray){

          if(err){
            return cb(err, null);
          }
          return cb(null, insertDocArray);
        });
      });
    },
    dbDocRemove: function(keyObj, collectionName, cb){
      db.collection(collectionName).remove(keyObj, {w:1}, function(err, result){
        if (err){
          return cb(err, null);
        }
        return cb(null, result);
      });
    }
  };
})();

//Change connection string based remote or local server deployment, remote services use environment variables
function setDbPath(dbName){
  // if OPENSHIFT env variables are present, use the available connection info:
  if(procE.OPENSHIFT_MONGODB_DB_PASSWORD){
    mongoUri = 'mongodb://' + procE.OPENSHIFT_MONGODB_DB_USERNAME + ":" +
      procE.OPENSHIFT_MONGODB_DB_PASSWORD + "@" +
      procE.OPENSHIFT_MONGODB_DB_HOST + ':' +
      procE.OPENSHIFT_MONGODB_DB_PORT + '/' + dbName;
  }
  else{
    //try heroku or local
    mongoUri = procE.MONGOLAB_URI || procE.MONGOHQ_URL || 'mongodb://localhost/' + dbName;
  }
  return mongoUri;
}

function dbConnect(dbPath, cb){
  mongoClient.connect(dbPath, function(err, db){
    if(err) {
      return cb(err, null);
    }
    return cb(null, db);
  });
}