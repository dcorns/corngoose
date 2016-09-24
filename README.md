#corngoose
A light weight interface for basic mongodb crud operations

## Getting Started

```shell
npm install corngoose --save
```

### Overview
In your project file

```javascript
var corngoose = require('corngoose');
```
####startDB
Connect to database:

```javascript
corngoose.startDB('databaseName', ['path'[':port']], [callback]);
```
If successful and no callback is provided, a console message will indicate the connection. Otherwise an error will be logged. There is no call back for this function so attempts to access the database could be attempted before the database is connected and if so an error will occur. As it is expected to be used in a web application, it is not likely that this will ever be a problem.

If a callback is provided it will be called with the usual parameters. (err, data) If there is an error data will be null and err will be the error object. If successful, err will be null and data will be a database object, however I do not recommend using the db object directly.

If no path is passed as the second argument to **corngoose.startDB**,it will look for the OPENSHIFT_MONGODB_IDENT environment variable and if it exists it will attempt to connect to the database using setting for the openshift cartridge indicated by the variable's value, otherwise it will look for OPENSHIFT_MONGODB_DB_PASSWORD and if it exists it will assume that the MongoDB 2.4 cartridge is being used and configure the connection for openshift accordingly. If it fails to find the openshift variables it will check for heroku (mongolab or mongohq) variables. If the heroku variables do not exist it will use the default mongo port and localhost for the connection. (local mongodb must be running) Deployment to other servers are not currently supported. Submit a pull request if you have another service you would like to have supported.

Unless otherwise noted in the documentation, errors that are generated by any dependencies of corngoose will be passed through the corngoose callback *err* parameter.
### Usage Examples
Show path to the connected database:

```javascript
console.log(corngoose.showDbPath()); //returns a string containing the path created by corngoose.startDB to the database and the database name provided as a parameter
```

####Disconnect and close the database connection: dbDisConnect
If disconnect fails, the error from mongo client is passed through otherwise a disconnect string message is provided.

Parameters:

    <Function>cb
```javascript
    corngoose.dbDisConnect(function(err, data){
      if(err) console.dir(err);
      else console.dir(data);
    });
```

####Insert document into database: dbDocInsert
The following parameters are required in order when using **dbDocInsert**:

    <Object>keyObj Specify an object with the unique properties and values contained in inserted document that will identify it in the collection
    <Object>docData The document object to insert.
    <String>collectionName The name of the collection in which to insert the document object.
    <Function>cb The function to execute passing in the error and data parameters when the insert fails or is completed.

Document insert is intended to be used for a single document insert into the specified collection. It checks for existing documents in the collection based on the key object passed in as the first parameter. If any existing documents contain the specified key, the insert will not take place and the following object will be passed in as the first argument to the callback. The second callback argument passed in will be null:


    {
       name: 'Duplicate Document',
       message:'A document with the key provided already exists',
       key: the object that was passed in as the key,
       existingDocument: The object in the collection that already contains the key
    }

If the insert succeeds, null will be passed in as the first argument and the inserted document will be passed in as the second.

{name: 'Wilber'} does not exist in the 'contacts' collection:

```javascript
    corngoose.dbDocInsert({name: 'Wilber'},{name: 'Wilber', species: 'pig'}, 'contacts', function(err, data){
      if (err) console.error(err);
      else{
        console.dir(data); //{ name: 'Wilber', species: 'pig', _id: ObjectID { _bsontype: 'ObjectID', id: 'V×S#¶ çÀ\u001fkúB' } }
      }
    });
```
{name: 'Wilber'} already exist in the 'contacts' collection:

```javascript
    corngoose.dbDocInsert({name: 'Wilber'},{name: 'Wilber', species: 'pig'}, 'contacts', function(err, data){
      if (err) console.error(err); //{ name: 'Duplicate Document',
                                   //  message: 'A document with the key provided already exists',
                                   //  key: { name: 'Wilber' },
                                   //  existingDocument: { _id: 56d75323b683e7c01f6bfa42, name: 'Wilber', species: 'pig' } }

      else{
        console.dir(data);
      }
    });
```
####Retreive Entire Collection: getCollection
Returns an array containing all the objects in the specified collection.

Parameters

    <String>collectionName Collection from which to retreive documents
    <Function>cb Callback function


```javascript
    corngoose.getCollection('contacts', function(err, data){
      if(err) console.error(err); //error passed in from dependency
      else console.dir(data); //array containing the objects contained in the 'contacts' collection.
    });
```
####Find Documents matching a query object: dbDocFind

Parameters

    <Object>queryObj object that specifies the cryteria for returned objects
    <String>collectionName the collection to search
    <Function>cb Callback function

```javascript
    corngoose.dbDocFind({name:'Wilber'},'contacts', function(err, data){
      if(err) console.error(err); //error passed in from dependency
      else {
        console.dir(data); //array of documents returned by the query
      }
    });
```

####Replace a document in a collection dbDocReplace
dbDocReplace would normally be used with dbDocFind to pull an existing document from the collection, make structural changes to the object and then replace the document in the collection with the new structure.

Parameters:

    <Object>doc an object with internal mongo ID matching the ID of document in the collection
    <String>collectionName the collection containing the document to be replaced
    <Function>cb callback function

```javascript
    corngoose.dbDocReplace(docFromCollection,'contacts', function(err, data){
      if(err) console.error(err);//error passed in from dependency
      else{
        console.dir(data.result);//object returned by depency
      }
    });
```

Update values specified in first document matching the query object: dbDocUpdate

Parameters:

    <Object>queryObj Query object for selecting documents to update
    <Object>updateObject Object containing the data to update
    <String>collectionName name of the target collection
    <Function>cb callback function

```javascript
    corngoose.dbDocUpdate({species: 'human'}, {species: 'pig'}, 'contacts', function(err, data){
      if (err) console.error(err); // error passed in from dependency
      else{
        console.dir(data); //object returned by depency
      }
    });
```

Remove one or more documents from a collection: dbDocRemove

    <Object>keyObj Key used for selecting the documents to remove from the collection
    <String>collectionName name of the collection from which to remove the documents
    <Function>cb Callback function

```javascript
    corngoose.dbDocRemove({name: 'Charlotte'}, 'contacts', function(err, data){
      if(err) console.error(err); // error passed in from dependency
      else{
        console.dir(data); //object returned by depency
      }
    });
```

Drop collection from database: dbDropCollection

Parameters:

    <String>collectionName name of collection to delete
    <Function>cb Callback function

```javascript
    corngoose.dbDropCollection('contacts', function(err, data){
      if(err) console.error(err); // error passed in from dependency
      else{
        console.dir(data); //booliean indicating whether or not the drop was successful
      }
    });
```

##Testing
Make sure that mongod is running before running test.
Run nmp test
    
## Contributing
In lieu of a formal style guide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality.

## Release History
_(1.0.0, 1.1.0)_<br/>
_(1.1.1,2)_ Update documentation<br/>
_(1.2.0)_ Add support for openshift community cartridge 'icflorescu:mongodb:3.2.6:2.0.4' and support for passing custom path and port to startDB<br/>
_(1.2.1)_ minor bug fix<br/>
_(1.3.0)_ no longer throw error if startDB fails, instead console log message and error then return false. A successful connection will return true
_(1.4.0)_ added call back to startDB, If you want to pass in the call back function, but are not passing in a custom path, you must pass **null** as the custom path parameter (startDB(_dbName_, null, _callback_);)
_(1.4.1)_ fixed bug in dbDocFind which kept _id from being used as the query object. This also caused dbDocUpdate to fail as well.

## License
Copyright (c) 2015 Dale Corns. Licensed under the MIT license.
