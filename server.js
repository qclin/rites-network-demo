const express = require('express');
const path = require('path');
const app = express();
const markov = require('./markov');

app.use(express.static(path.join(__dirname, 'build')));

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});


app.get('/markov/:payload', function(req, res){
  var payload = req.params.payload;
  var result = markov.generateText(payload)
  console.log("markov and swapped", result)
  result.then(function(data){
    var predictedText = data.toString();
    console.log("post promisesss : ", predictedText);
    res.json({predicted : predictedText});
  })
});
app.listen(4000);
console.log('Listening on port 4000');
