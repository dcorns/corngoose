/**
 * test
 * Created by dcorns on 2/29/16
 * Copyright © 2016 Dale Corns
 */
'use strict';
var corngoose = require('./corngoose');
var withCb = require('./corngoose');
var rdoc;
corngoose.startDB('corngooseTestDB');

//wait for connection before testing
console.log('startDB test... (if it does not work, everything else fails)');
setTimeout(afterDbStart, 1000);


//test all functions
function afterDbStart(){
  console.log('showDbPath test...');
  corngoose.showDbPath();

  //Test Document Insertion
  console.log('dbDocInsert test1');
  corngoose.dbDocInsert({name: 'Wilber'},{name: 'Wilber', species: 'pig'}, 'contacts', function(err, data){
    if (err) console.error(err);
    else{
      console.dir(data);
      //Test Document Anti-duplication
      console.log('dbDocInsert test2');
      corngoose.dbDocInsert({name: 'Wilber'},{name: 'Wilber', species: 'pig'}, 'contacts', function(err, data){
        if (err) console.error(err);
        else{
          console.dir(data);
        }
      });
    }
    //Test Document Insertion
    console.log('dbDocInsert test3');
    corngoose.dbDocInsert({name: 'Charlotte'},{name: 'Charlotte', species: 'arachnid'}, 'contacts', function(err, data){
      if (err) console.error(err);
      else{
        console.dir(data);
        //Test Document anti-duplication
        console.log('dbDocInsert test4');
        corngoose.dbDocInsert({name: 'Charlotte'},{name: 'Charlotte', species: 'arachnid'}, 'contacts', function(err, data){
          if (err) console.error(err);
          else console.dir(data);
          console.dir('After Records Insert Tests...');
          afterRecordsInsert();
        });
      }
    });
  });


}

function afterRecordsInsert(){
  console.log('getCollection test...');
  corngoose.getCollection('contacts', function(err, data){
    if(err) console.error(err);
    else console.dir(data);
  });
  console.log('dbDocFind test...');
  corngoose.dbDocFind({name:'Wilber'},'contacts', function(err, data){
    if(err) console.error(err);
    else {
      console.dir(data);
      rdoc = data[0];
      rdoc.species = 'human';
      console.dir(rdoc);
      console.log('dbDocReplace test...');
      corngoose.dbDocReplace(rdoc,'contacts', function(err, data){
        if(err) console.error(err);
        else{
          console.dir(data.result);
          console.log('dbDocUpdate test...');
          corngoose.dbDocUpdate({species: 'human'}, {species: 'pig'}, 'contacts', function(err, data){
            if (err) console.error(err);
            else{
              console.dir(data.result);
              console.log('dbDocRemove test...');
              corngoose.dbDocRemove({name: 'Charlotte'}, 'contacts', function(err, data){
                if(err) console.error(err);
                else{
                  console.dir(data.result);
                  console.log('dbDropCollection test...');
                  corngoose.dbDropCollection('contacts', function(err, data){
                    if(err) console.error(err);
                    else{
                      console.dir(data);
                    }
                    console.log('dbDisconnect test...');
                    corngoose.dbDisConnect(function(err, data){
                      if(err) console.err(err);
                      else console.dir(data);
                    });
                  });
                }
              });
            }
          })
        }
      });
    }
  });
}