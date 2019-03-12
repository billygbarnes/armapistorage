

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


var port = 8001;

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
 
 res.send('GET livedata...' + Date.now());
  console.log('GET livedata');
  
 });


app.listen(process.env.PORT || port, () => {
  console.log("==========================================");
  console.log('We are live API on ' + port);
});
