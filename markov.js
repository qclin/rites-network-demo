var markov = require('markovchain')
      , fs = require('fs')

// var catAccelerate = './text-markov/accelerationism/reader.txt'
// var catMysticism = './text-markov/mysticism/chaos_protocol.txt'
// var catPlantemotion = './text-markov/plant_emotion/nihms279216.txt'
// var catYoutube = './text-markov/youtuber_says/reactionvideo.txt'

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

    console.log(sentence)
    return sentence
  }
}
