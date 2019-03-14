

var express = require('express');
var bodyParser = require('body-parser');
var azure = require('azure-storage');

var tblKey = process.env.STKEY; 
var tblSvc = process.env.STNAME; 'tmpstorageoil';

var app            = express();

// uses AZURE_STORAGE_ACCOUNT and AZURE_STORAGE_ACCESS_KEY, or AZURE_STORAGE_CONNECTION_STRING,
// or specify on the TableService call.
 var tableSvc = azure.createTableService(tblSvc, tblKey);
 tableSvc.createTableIfNotExists('pocData', function(error, result, response){
  if(!error){
    // Table exists or created
  }
});

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())


var port = 8001; // Had problems getting this to run on anything but port 80.

function readPocData(name){

}

function writePocData(name, val){
  console.log("writePocData: " + name + ', ' + val);


  var entGen = azure.TableUtilities.entityGenerator;
  var task = {
    PartitionKey: entGen.String('AGA3'),
    RowKey: entGen.String(name),
    value: entGen.String(val),
  };

  tableSvc.insertOrReplaceEntity ('pocData',task, function (error, result, response) {
    if(!error){
      // Entity inserted
      console.log("writePocData: Success");

    }
    else{
      console.log("writePocData: Error");
    }
  });

}

//require('./routes/livedata')(app, {});
app.post('/livedata', (req, res) => {
  var j = JSON.stringify(req.body, null, 2)
  res.send('Posting to livedata...' + j);
  console.log('POST livedata: ' + j);
  for(var a in req.body){
    //console.log(a +": " + req.body[a]);
    writePocData(a, req.body[a])
    
}
});

app.get('/livedata', (req, res) => {
 // var r = readPocData('n');
 // console.log('app.get: ' + r);
 // res.send('GET livedata...' + Date.now() + ': ' + r);
    console.log('GET livedata');
     
    // readPocData() moved to here to simplify PoC.
    var q = new azure.TableQuery()
      .where('PartitionKey eq ?', 'AGA3');
  
     console.log("readPocData()");
    tableSvc.queryEntities('pocData',q, null, function(error, result, response) {
      if(!error) {
        // query was successful
        console.log("readPocData() success");
        console.log(result.entries);
        
        // Create the payload from the result.entries.........
        var ret = {};
        
        for(var i = 0; i< result.entries.length; i++) {
          var k = result.entries[i].RowKey._;
          var v = result.entries[i].value._;
          var t = result.entries[i].Timestamp._;
                    
          var d = {
            value: v,
            timestamp: t
          };

           ret[k] = d;          
        }
        res.send(ret);  //( result.entries);
      }
      else {
        console.log("readPocData() error");
        res.send( {'error': -1});
      }
    }); 
  
 });


app.listen(process.env.PORT || port, () => {
  console.log("==========================================");
  console.log('We are live API on ' + port);
});
