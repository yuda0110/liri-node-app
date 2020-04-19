const fs = require('fs');

module.exports = function() {
  const separator = '\n====================================\n\n';
  this.write = function(output, log) {
    fs.appendFile('./log.txt', `${log}${separator}`, function(err) {
      if (err) {
        return console.log(err);
      }
      console.log(output);
    });
  }
};