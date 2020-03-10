var express = require('express');
const lc = require('@lto-network/lto-crypto');
const prompt = require('prompt-sync')();
var fs = require('fs');
const chalk = require('chalk');

var app = express();

//const LTO = require('lto-api').LTO;
//const lto = new LTO();

app.use(express.json());

var textByLine = fs.readFileSync('./wordlist.txt').toString().split("\r\n");

const randWord = () => {
  var rando = Math.floor(Math.random() * 2048);
  return textByLine[rando];
};

const seedPhrase = () => {
  var phrase = [];
  for (var i = 0; i < 12; i++) {
    phrase.push(randWord());
  }
  var seedWords = phrase.join(" ");
  return seedWords;
}

const bruteForceStart = (fullString, sensitive) => {
  var timeStart = new Date().getTime();
  if (sensitive == "no") {
    var lowerString = fullString.toLowerCase();
    for (var i = 0; i <= 1000000; i++) {
      var attempt = seedPhrase();
      var address = lc.address(attempt);
      if (address.toLowerCase().startsWith(lowerString)) {
        var timeStop = new Date().getTime();
        var pair = lc.keyPair(attempt);
        console.log("\nsucces! "+ chalk.bold(address) + "\nseed: " + chalk.bold(attempt) + "\nprivate: " + chalk.bold(pair.private) + "\npublic: " + chalk.bold(pair.public));
        console.log("\nstatistics:");
        console.log("took " + i + " tries and " + (timeStop - timeStart) + " ms (" + ((timeStop - timeStart) / i) + " ms per try)\n\n");
        process.exit(0);
      } else {
        //console.log(i);
      };
      if ((i % 5000) == 0) {
        console.log(i + " attempts... still going...");
      }
    }
  } else if (sensitive == "yes") {
    for (var i = 0; i <= 1000000; i++) {
      var attempt = seedPhrase();
      var address = lc.address(attempt);
      if (address.startsWith(fullString)) {
        var timeStop = new Date().getTime();
        var pair = lc.keyPair(attempt);
        console.log("\nsucces! "+ chalk.bold(address) + "\nseed: " + chalk.bold(attempt) + "\nprivate: " + chalk.bold(pair.private) + "\npublic: " + chalk.bold(pair.public));
        console.log("\nstatistics:");
        console.log("took " + i + " tries and " + (timeStop - timeStart) + " ms (" + ((timeStop - timeStart) / i) + " ms per try)\n\n");
        process.exit(0);
      } else {
        //console.log(i);
      };
      if ((i % 5000) == 0) {
        console.log(i + " attempts... still going...");
      }
    }
  } else {
    console.log("\nthere was an error, make sure you enter lowercase answers, exactly as specified.")
    process.exit();
  }
};

const bruteForceEnd = (string, sensitive) => {
  var timeStart = new Date().getTime();
  if (sensitive == "no") {
    var lowerString = string.toLowerCase();
    for (var i = 0; i <= 1000000; i++) {
      var attempt = seedPhrase();
      var address = lc.address(attempt);
      if (address.toLowerCase().endsWith(lowerString)) {
        var timeStop = new Date().getTime();
        var pair = lc.keyPair(attempt);
        console.log("\nsucces! "+ chalk.bold(address) + "\nseed: " + chalk.bold(attempt) + "\nprivate: " + chalk.bold(pair.private) + "\npublic: " + chalk.bold(pair.public));
        console.log("\nstatistics:");
        console.log("took " + i + " tries and " + (timeStop - timeStart) + " ms (" + ((timeStop - timeStart) / i) + " ms per try)\n\n");
        process.exit(0);
      } else {
        //console.log(i);
      };
      if ((i % 5000) == 0) {
        console.log(i + " attempts... still going...");
      }
    }
  } else if (sensitive == "yes") {
    for (var i = 0; i <= 1000000; i++) {
      var attempt = seedPhrase();
      var address = lc.address(attempt);
      if (address.endsWith(string)) {
        var timeStop = new Date().getTime();
        var pair = lc.keyPair(attempt);
        console.log("\nsucces! "+ chalk.bold(address) + "\nseed: " + chalk.bold(attempt) + "\nprivate: " + chalk.bold(pair.private) + "\npublic: " + chalk.bold(pair.public));
        console.log("\nstatistics:");
        console.log("took " + i + " tries and " + (timeStop - timeStart) + " ms (" + ((timeStop - timeStart) / i) + " ms per try)\n\n");
        process.exit(0);
      } else {
        //console.log(i);
      };
      if ((i % 5000) == 0) {
        console.log(i + " attempts... still going...");
      }
    }
  } else {
    console.log("\nthere was an error, make sure you enter lowercase answers, exactly as specified.")
    process.exit();
  }
};

const pattern = prompt('What is your pattern? ');

const caseSensitivity = prompt('Case sensitive (yes/no)? ');

const location = prompt('At what location? (start/end)? ' );


if (location == "start") {
  console.log(`\nBruteforcing an address with pattern ` + "3J" + pattern + ` at the ${location}, case sensitive: ${caseSensitivity}`);
  bruteForceStart("3J" + pattern, caseSensitivity);
} else if (location == "end") {
  console.log(`\nBruteforcing an address with pattern ` + pattern + ` at the ${location}, case sensitive: ${caseSensitivity}`);
  bruteForceEnd(pattern, caseSensitivity);
} else {
  console.log("\nthere was an error, make sure you enter lowercase answers, exactly as specified.")
  process.exit()
};

module.exports = app;