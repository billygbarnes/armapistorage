

var express = require('express');

const app            = express();

const port = 8001;

require('./routes/livedata')(app, {});

app.listen(port, () => {
  console.log('We are live API on ' + port);
});
