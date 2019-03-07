

var express = require('express');

var app            = express();

var port = 8001;

require('./routes/livedata')(app, {});

app.listen(process.env.PORT || port, () => {
  console.log('We are live API on ' + port);
});
