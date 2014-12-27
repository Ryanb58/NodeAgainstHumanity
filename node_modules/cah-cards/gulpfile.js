var gulp = require('gulp');
var _ = require('lodash');
var request = require('request');
var through = require('through2');
var fs = require('fs');

var headHandled = false;

var sanitizeHead = through(function(chunk, enc, cb){
  if(!headHandled){
    var head = String(chunk);
    var cleaned = head.replace('masterCards = ', '');
    this.push(new Buffer(cleaned));
    headHandled = true;
  } else {
    this.push(chunk);
  }
  cb();
});

function finishToEnd(){
  this.emit('end');
}

function out(filename, data){
  var stream = fs.createWriteStream(filename);
  stream.on('finish', finishToEnd);
  stream.end(JSON.stringify(data, null, 2));
  return stream;
}

function fetchCards(){
  return request('https://raw.github.com/samurailink3/hangouts-against-humanity/master/source/data/cards.js')
    .pipe(sanitizeHead)
    .pipe(fs.createWriteStream('./cards.json'))
    .on('finish', finishToEnd);
}

function loadCards(){
  return require('./cards.json');
}

function loadQuestions(){
  return require('./questions.json');
}

function generateQuestions(){
  var cards = loadCards();
  var groups = _.groupBy(cards, 'cardType');
  var questions = _.indexBy(groups.Q, 'id');
  return out('./questions.json', questions);
}

function generateAnswers(){
  var cards = loadCards();
  var groups = _.groupBy(cards, 'cardType');
  var answers = _(groups.A).indexBy('id').mapValues(_.partialRight(_.omit, 'numAnswers')).value();
  return out('./answers.json', answers);
}

function filterQuestions(answers, num){
  return _.reduce(answers, function(res, val, key){
    if(val.numAnswers === num){
      res[key] = val;
    }
    return res;
  }, {});
}

function generatePick1(){
  var answers = loadQuestions();
  var pick1 = filterQuestions(answers, 1);
  return out('./pick1.json', pick1);
}

function generatePick2(){
  var answers = loadQuestions();
  var pick2 = filterQuestions(answers, 2);
  return out('./pick2.json', pick2);
}

function generatePick3(){
  var answers = loadQuestions();
  var pick3 = filterQuestions(answers, 3);
  return out('./pick3.json', pick3);
}

gulp.task('fetch cards', fetchCards);
gulp.task('generate questions', ['fetch cards'], generateQuestions);
gulp.task('generate pick1', ['generate questions'], generatePick1);
gulp.task('generate pick2', ['generate questions'], generatePick2);
gulp.task('generate pick3', ['generate questions'], generatePick3);
gulp.task('generate answers', ['fetch cards'], generateAnswers);
gulp.task('generate cards', [
  'generate questions',
  'generate answers',
  'generate pick1',
  'generate pick2',
  'generate pick3',
]);

gulp.task('default', ['generate cards']);
