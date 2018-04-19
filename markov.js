var markov = require('markovchain')
      , fs = require('fs')

var spawn = require("child_process").spawn;


var useUpperCase = function(wordList) {
  var tmpList = Object.keys(wordList).filter(function(word) {
    return word[0] >= 'A' && word[0] <= 'Z'
  })
  return tmpList[~~(Math.random()*tmpList.length)]
}

module.exports = {
  generateText : function (payload){
    var tags = payload.split('|');
    var category = tags[0];
    var txt = new markov(fs.readFileSync('./text-markov/textcat1.txt', 'utf8'))
    var sentence = txt.start(useUpperCase).end(15).process()

    console.log("before_spawn::", sentence, spawn)

    var pythonProcess = spawn('python',["./parse.py","It is great way to be convincingly create solutions for the continued development of viral vectors"]);

    pythonProcess.stdout.on('data', function (data){
    // Do something with the data returned from python script
      console.log('pythonProcess:::', data);
      var interpreted = decodeURIComponent(data);
      console.log('interpreted :::', interpreted); 
    });

    return sentence
  }
}
