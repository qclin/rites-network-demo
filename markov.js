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
    var txt = new markov(fs.readFileSync(`./text-markov/textcat${category}.txt`, 'utf8'))
    var sentence = txt.start(useUpperCase).end(15).process()
    console.log("before_spawn::", sentence);

    /// gets messy here, should be able to refactor the promise
    let runPy = new Promise(function(resolve, reject){

      var wordsToInsert = tags.slice(1,tags.length);
      var pythonProcess = spawn('python',["./parse.py",sentence, wordsToInsert]);

      pythonProcess.stdout.on('data', function (data){
        var interpreted = decodeURIComponent(data);
        console.log('interpreted :::', interpreted, typeof interpreted);
        resolve(interpreted)
      });
      pythonProcess.stdout.on('data', (data) =>{
        reject(data);
      });

    });
    return runPy;


    // pythonProcess.stdout.on('data', function (data){
    // // Do something with the data returned from python script
    //   // console.log('pythonProcess:::', data);
    //   var interpreted = decodeURIComponent(data);
    //   console.log('interpreted :::', interpreted, typeof interpreted);
    //   return interpreted
    //
    // });
    // return sentence
  }
}
