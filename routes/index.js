var express = require('express');
var router = express.Router();
var request = require('request');
var mongoose= require('mongoose');
var options = { server: { socketOptions: {connectTimeoutMS: 30000 } }};
mongoose.connect('mongodb://alain:moviz@ds1497855.mlab.com:49855/mymoviesapp', options , function(err) {
  console.log(err);
});

var movieSchema = mongoose.Schema({
  poster_path: String,
  overview: String,
  title: String,
  idMovieDB: Number
});

var movieModel = mongoose.model("movie", movieSchema);

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});


router.get('/movies', function(req, res, next) {
  request("https://api.themoviedb.org/3/discover/movie?api_key=1ca4416921624503090524859d7764888835&language=fr-FR&region=FR&sort_by=popularity.desc&include_adult=false&include_video=false&page=1", function(error, response, body){
    body = JSON.parse(body);
    res.json(body.results);
  })
});

router.get('/mymovies', function(req, res, next) {
  movieModel.find(function(error, datas) {
    res.json(datas);
  })
});

router.post('/mymovies', function(req, res, next) {
  var movie = new movieModel({
    poster_path: req.body.poster_path,
    title: req.body.title,
    overview: req.body.overview,
    idMovieDB: req.body.idMovieDB
  });
  movie.save(function(error, data){
    res.json({result: true});
  })
});

router.delete('/mymovies/:movieId', function(req, res, next) {
  movieModel.remove({ idMovieDB: req.params.movieId}, function(error) {
      res.json({result: true});
    }
  );
});

module.exports = router;
