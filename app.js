

var express = require('express');
var bodyParser = require('body-parser');

var app            = express();

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())


var port = 8001;

//require('./routes/livedata')(app, {});
app.post('/livedata', (req, res) => {
  var j = JSON.stringify(req.body, null, 2)
  res.send('Posting to livedata...' + j);
  console.log('POST livedata: ' + j);
});

app.get('/livedata', (req, res) => {
 
 res.send('GET livedata...' + Date.now());
  console.log('GET livedata');
  
 });


app.listen(process.env.PORT || port, () => {
  console.log("==========================================");
  console.log('We are live API on ' + port);
});
