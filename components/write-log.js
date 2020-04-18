const fs = require('fs');

module.exports = function(text) {
  const separator = '\n====================================\n\n';
  this.write = function(text) {
    fs.appendFile('./log.txt', `${text}${separator}`, function(err) {
      if (err) {
        return console.log(err);
      }
      console.log('Log added!');
    });
  }
};