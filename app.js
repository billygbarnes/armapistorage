

var express = require('express');

var app            = express();

var port = 8001;

//require('./routes/livedata')(app, {});
app.post('/livedata', (req, res) => {
  // You'll create your note here.
  res.send('Posting to livedata...' + req.body);
  console.log(req.body);
});

app.get('/livedata', (req, res) => {
 
 res.send('GET livedata...' + Date.now());
  console.log('GET livedata');
  
 });


app.listen(process.env.PORT || port, () => {
  console.log("==========================================");
  console.log('We are live API on ' + port);
});
