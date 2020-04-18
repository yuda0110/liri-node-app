require('dotenv').config();
const keys = require('../keys.js');
const Spotify = require('node-spotify-api');
const WriteLog = require('./write-log');
const Commands = require('./commands');

const writeLog = new WriteLog();
const commands = new Commands();

// node liri.js spotify-this-song '<song name here>'
module.exports = function() {
  let output = '';
  let log = `Command: ${commands.spotify}\n`;

  this.findSong = function(songName) {
    const spotify = new Spotify(keys.spotify);

    // If no song is provided then your program will default to "The Sign" by Ace of Base.
    const songNameProvided = songName ? true : false;

    if (!songNameProvided) {
      songName = 'The Sign';
      output += 'You didn\'t enter a song name. Here is a song for you.\n';
    }

    spotify
      .search({ type: 'track', query: songName })
      .then(function(response) {
        // console.log(response.tracks.items);
        const items = response.tracks.items;
        let itemsArr = [];

        if (songNameProvided) { // If a song name is provided
          itemsArr = items;
        } else {
          items.forEach((item) => {
            if (item.artists[0].name.toLowerCase() === 'ace of base') {
              itemsArr.push(item);
            }
          })
        }

        if (itemsArr.length <= 0) {
          output += `Sorry, no result found for ${songName}.\n`;
        } else {
          itemsArr.forEach((item) => {
            // Artist(s)
            output += `Artist(s): ${item.artists[0].name}\n`;
            // The song's name
            output += `The song's name: ${item.name}\n`;
            // A preview link of the song from Spotify
            output += `Preview link: ${item.preview_url}\n`;
            // The album that the song is from
            output += `The album: ${item.album.name}\n`;
            output += '\n';
          });
        }
        console.log(output);
        log += output;
        writeLog.write(log);
      })
      .catch(function(err) {
        output += `${JSON.stringify(err, null, 2)}\n\n`;
        console.log(output);
        log += output;
        writeLog.write(log);
      });
  }
};