#corngoose
A light weight interface for basic mongodb crud operations

## Getting Started

```shell
npm install corngoose --save
```

### Overview
In your project file `var corngoose = require('corngoose');`.
####startDB
Connect to database: `corngoose.startDB('databaseName');`
If successful, a console message will indicate the connection. Otherwise an error will be logged. There is no call back for this function so attempts to access the database could be attempted before the database is connected and if so an error will occur. As it is expected to be used in a web application, it is not likely that this will ever be a problem.

corngoose.startDB will check for heroku (mongolab or mongohq) and openshift variables allowing smooth deployment to their servers. Deployment to other servers are not currently supported. Submit a pull request if you have another service you would like to have supported.

Unless otherwise noted in the documentation, errors that are generated by any dependencies of corngoose will be passed through the corngoose callback *err* parameter.
### Usage Examples
Show path to the connected database:

```console.log(corngoose.showDbPath()); //returns a string containing the path created by corngoose.startDB to the database and the database name provided as a parameter```

####Disconnect and close the database connection: dbDisConnect
If disconnect fails, the error from mongo client is passed through otherwise a disconnect string message is provided.

Parameters:

    +<Function>cb

    corngoose.dbDisConnect(function(err, data){
      if(err) console.err(err);
      else console.dir(data);
    });

####Insert document into database: dbDocInsert
The following parameters are required in order when using **dbDocInsert**:

    +<Object>keyObj Specify an object with the unique properties and values contained in inserted document that will identify it in the collection
    +<Object>docData The document object to insert.
    +<String>collectionName The name of the collection in which to insert the document object.
    +<Function>cb The function to execute passing in the error and data parameters when the insert fails or is completed.

Document insert is intended to be used for a single document insert into the specified collection. It checks for existing documents in the collection based on the key object passed in as the first parameter. If any existing documents contain the specified key, the insert will not take place and the following object will be passed in as the first argument to the callback. The second callback argument passed in will be null:

    {name: Duplicate Document,
     message:'A document with the key provided already exists',
     key: the object that was passed in as the key,
     existingDocument: The object in the collection that already contains the key
     }

If the insert succeeds, null will be passed in as the first argument and the inserted document will be passed in as the second.

{name: 'Wilber'} does not exist in the 'contacts' collection:

    corngoose.dbDocInsert({name: 'Wilber'},{name: 'Wilber', species: 'pig'}, 'contacts', function(err, data){
        if (err) console.error(err);
        else{
          console.dir(data); //{ name: 'Wilber', species: 'pig', _id: ObjectID { _bsontype: 'ObjectID', id: 'V×S#¶ çÀ\u001fkúB' } }
        }
    });
  
{name: 'Wilber'} already exist in the 'contacts' collection:

    corngoose.dbDocInsert({name: 'Wilber'},{name: 'Wilber', species: 'pig'}, 'contacts', function(err, data){
            if (err) console.error(err); //{ name: 'Duplicate Document',
                                         //  message: 'A document with the key provided already exists',
                                         //  key: { name: 'Wilber' },
                                         //  existingDocument: { _id: 56d75323b683e7c01f6bfa42, name: 'Wilber', species: 'pig' } }

            else{
              console.dir(data);
            }
    });

####Retreive Entire Collection: getCollection
Returns an array containing all the objects in the specified collection.

Parameters

    +<String>collectionName Collection from which to retreive documents
    +<Function>cb Callback function

    corngoose.getCollection('contacts', function(err, data){
        if(err) console.error(err); //error passed in from dependency
        else console.dir(data); //array containing the objects contained in the 'contacts' collection.
    });

####Find Documents matching a query object: dbDocFind

Parameters

    +<Object>queryObj object that specifies the cryteria for returned objects
    +<String>collectionName the collection to search
    +<Function>cb Callback function

    corngoose.dbDocFind({name:'Wilber'},'contacts', function(err, data){
        if(err) console.error(err); //error passed in from dependency
        else {
          console.dir(data); //array of documents returned by the query
        }
    });

####Replace a document in a collection dbDocReplace
dbDocReplace would normally be used with dbDocFind to pull an existing document from the collection, make structural changes to the object and then replace the document in the collection with the new structure.

Parameters:

    +<Object>doc an object with internal mongo ID matching the ID of document in the collection
    +<String>collectionName the collection containing the document to be replaced
    +<Function>cb callback function
    
    corngoose.dbDocReplace(docFromCollection,'contacts', function(err, data){
            if(err) console.error(err);//error passed in from dependency
            else{
              console.dir(data.result);//object returned by depency
            }
    });

Update values specified in first document matching the query object: dbDocUpdate

Parameters:

    +<Object>queryObj Query object for selecting documents to update
    +<Object>updateObject Object containing the data to update
    +<String>collectionName name of the target collection
    +<Function>cb callback function
    
    corngoose.dbDocUpdate({species: 'human'}, {species: 'pig'}, 'contacts', function(err, data){
                if (err) console.error(err); // error passed in from dependency
                else{
                  console.dir(data); //object returned by depency
                }
    }

Remove one or more documents from a collection: dbDocRemove

    +<Object>keyObj Key used for selecting the documents to remove from the collection
    +<String>collectionName name of the collection from which to remove the documents
    +<Function>cb Callback function
    
    corngoose.dbDocRemove({name: 'Charlotte'}, 'contacts', function(err, data){
      if(err) console.error(err); // error passed in from dependency
      else{
        console.dir(data); //object returned by depency
      }
    });

#### Default Options



## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality.

## Release History
_(Nothing yet)_

## License
Copyright (c) 2015 Dale Corns. Licensed under the MIT license.
