#corngoose
A light weight interface for basic mongodb crud operations

## Getting Started

```shell
npm install corngoose --save
```

### Overview
In your project file `var corngoose = require('corngoose');`.

Connect to database: `corngoose.startDB('databaseName');`
If successful, a console message will indicate the connection. Otherwise an error will be logged. There is no call back for this function so attempts to access the database could be attempted before the database is connected and if so an error will occur. As it is expected to be used in a web application, it is not likely that this will ever be a problem.

corngoose.startDB will check for heroku (mongolab or mongohq) and openshift variables allowing smooth deployment to their servers. Deployment to other servers are not currently supported. Submit a pull request if you have another service you would like to have supported.
### Usage Examples

Show path to the connected database:

```corngoose.showDbPath();```

Disconnect and close the database connection:

    corngoose.dbDisConnect(function(err, data){
      if(err) console.err(err);
      else console.dir(data);
    });

Insert document into database:

#### Default Options
In this example, the dist and dev are used to do something with whatever. So if the `testing` file has the content `Testing` and the `123` file had the content `1 2 3`, the generated result would be `Testing, 1 2 3.`


## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).

## Release History
_(Nothing yet)_

## License
Copyright (c) 2015 Dale Corns. Licensed under the MIT license.
