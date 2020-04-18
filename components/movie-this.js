const axios = require('axios');
const WriteLog = require('./write-log');
const Commands = require('./commands');
const AxiosError = require('./axios-error');

const writeLog = new WriteLog();
const commands = new Commands();
const axiosError = new AxiosError();

// node liri.js movie-this '<movie name here>'
module.exports = function() {
  let output = '';
  let log = `Command: ${commands.movie}\n`;
  let errorFlag = false;

  this.findMovie = function(movieTitle) {
    // If the user doesn't type a movie in, the program will output data for the movie 'Mr. Nobody'.
    const movieTitleProvided = movieTitle ? true : false;

    if (!movieTitleProvided) {
      movieTitle = 'Mr. Nobody';
      output += 'You didn\'t enter a movie title. Here is a movie for you.\n';
    }

    const omdbQueryURL = `http://www.omdbapi.com/?t=${movieTitle}&y=&plot=short&apikey=trilogy`;
    console.log(`omdbQueryURL: ${omdbQueryURL}`);

    const request = axios.get(omdbQueryURL)
      .catch((error) => {
        axiosError.log(error, output, log);
        errorFlag = true;
      });

    // If the request with axios is successful
    // request.then(console.log);

    request.then((res) => {
      if (errorFlag) {
        return;
      }

      output += `-------------- ${movieTitle.toUpperCase()}'s INFO --------------\n`;

      const movieData = res.data;

      if (!movieData.Title) {
        output += 'Sorry, the movie you typed in doesn\'t exist in the database.';
        log += output;
        console.log(output);
        writeLog.write(log);
        return;
      }

      // Title of the movie.
      output += `Title: ${movieData.Title}\n`;

      // Year the movie came out.
      output += `Year: ${movieData.Year}\n`;

      let imdbRating = '';
      let rottenTomatoesRating = '';
      movieData.Ratings.forEach(item => {
        if (item.Source.toLowerCase() === 'Internet Movie Database'.toLowerCase()) {
          imdbRating = item.Value;
        } else if (item.Source.toLowerCase() === 'Rotten Tomatoes'.toLowerCase()) {
          rottenTomatoesRating = item.Value;
        }
      });

      // IMDB Rating of the movie.
      output += `IMDB Rating: ${imdbRating}\n`;

      // Rotten Tomatoes Rating of the movie.
      output += `Rotten Tomatoes Rating: ${rottenTomatoesRating}\n`;

      // Country where the movie was produced.
      output += `Country: ${movieData.Country}\n`;

      // Language of the movie.
      output += `Language: ${movieData.Language}\n`;

      // Plot of the movie.
      output += `Plot: ${movieData.Plot}\n`;

      // Actors in the movie.
      output += `Actors: ${movieData.Actors}\n`;

      console.log(output);

      log += output;

      writeLog.write(log);
    });
  }
};