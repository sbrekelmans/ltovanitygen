var express = require('express');
const lc = require('@lto-network/lto-crypto');
const prompt = require('prompt-sync')();
var fs = require('fs');
const chalk = require('chalk');
const { callbackify } = require('util');

var app = express();
const maxTries = 10000000000; //lower this to limit the amount of tries currently set to approximately a year - so practically infinite

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
    for (var i = 0; i <= maxTries; i++) {
      var attempt = seedPhrase();
      var address = lc.address(attempt, 'T'); //remove this 'T' for mainnet wallets
      if (address.toLowerCase().startsWith(lowerString,2)) {
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
    for (var i = 0; i <= maxTries; i++) {
      var attempt = seedPhrase();
      var address = lc.address(attempt); //add a 'T' for testnet wallets
      if (address.startsWith(fullString,2)) {
        var timeStop = new Date().getTime();
        var pair = lc.keyPair(attempt);
        console.log("\nsucces! "+ chalk.bold(address) + "\nseed: " + chalk.bold(attempt) + "\nprivate: " + chalk.bold(pair.private) + "\npublic: " + chalk.bold(pair.public));
        console.log("\nstatistics:");
        console.log("took " + i + " tries and " + (timeStop - timeStart) + " ms (" + ((timeStop - timeStart) / i) + " ms per try)\n\n");
        process.exit(0);
      } else {
        //console.log(i);
      };
      if (i>0 && (i % 5000) == 0) {
        let now = new Date().getTime();
        console.log(i + " attempts... at " + chalk.bold(((now - timeStart) / i).toFixed(2)) + " ms per try. Still going...");
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
    for (var i = 0; i <= maxTries; i++) {
      var attempt = seedPhrase();
      var address = lc.address(attempt); //add a 'T' for testnet wallets
      if (address.toLowerCase().endsWith(lowerString)) {
        var timeStop = new Date().getTime();
        var pair = lc.keyPair(attempt);
        process.stderr.write("\007");
        console.log("\nsucces! "+ chalk.bold(address) + "\nseed: " + chalk.bold(attempt) + "\nprivate: " + chalk.bold(pair.private) + "\npublic: " + chalk.bold(pair.public));
        console.log("\nstatistics:");
        console.log("took " + i + " tries and " + (timeStop - timeStart) + " ms (" + ((timeStop - timeStart) / i) + " ms per try)\n\n");
        process.exit(0);
      } else {
        //console.log(i);
      };
      if (i>0 && (i % 5000) == 0) {
        let now = new Date().getTime();
        console.log(i + " attempts... at " + chalk.bold(((now - timeStart) / i).toFixed(2)) + " ms per try. Still going...");
      }
    }
  } else if (sensitive == "yes") {
    for (var i = 0; i <= maxTries; i++) {
      var attempt = seedPhrase();
      var address = lc.address(attempt); //add a 'T' for testnet wallets
      if (address.endsWith(string)) {
        var timeStop = new Date().getTime();
        var pair = lc.keyPair(attempt);
        process.stderr.write("\007");
        console.log("\nsucces! "+ chalk.bold(address) + "\nseed: " + chalk.bold(attempt) + "\nprivate: " + chalk.bold(pair.private) + "\npublic: " + chalk.bold(pair.public));
        console.log("\nstatistics:");
        console.log("took " + i + " tries and " + (timeStop - timeStart) + " ms (" + ((timeStop - timeStart) / i) + " ms per try)\n\n");
        process.exit(0);
      } else {
        //console.log(i);
      };
      if (i>0 && (i % 5000) == 0) {
        let now = new Date().getTime();
        console.log(i + " attempts... at " + chalk.bold(((now - timeStart) / i).toFixed(2)) + " ms per try. Still going...");
      }
    }
  } else {
    console.log("\nthere was an error, make sure you enter lowercase answers, exactly as specified.")
    process.exit();
  }
};

const calculatePossibilities = (pattern, caseSensitivity) => {
  let charOptions = 2;
  let correction = 1;
  if(caseSensitivity==="yes"){
    charOptions = 1;
  } else if (pattern.match(/(L|i|o|[0-9])/g)) {
    correction = Math.pow(2,(pattern.match(/(L|i|o|[0-9])/g).length));
  };
  const odds = Math.pow(charOptions/58, pattern.length);
  console.log("At 8ms per attempt this will take an estimated " + chalk.bold(((correction*8/odds)/(60000)).toFixed(0)) + " minutes or "+ chalk.bold(((correction*8/odds)/(60*24*60000)).toFixed(1)) + " days for a 50% chance of finding the pattern.")
}

let pattern = ''

const getPattern = () => {
  pattern = prompt('What is your pattern? ');
  if(pattern.includes("I") || pattern.includes("l") ||pattern.includes("0") ||pattern.includes("O")){
    console.log("Address and pattern are BASE58 and can't contain an I - capital i, l - lowercase L, 0 - zero or O - capital o")
    getPattern();
  };
}
getPattern();

const caseSensitivity = prompt('Case sensitive (yes/no)? ').toLowerCase();

const location = prompt('At what location? (start/end)? ' ).toLowerCase();


if (location == "start") {
  if(caseSensitivity=="yes" && pattern.charAt(0).toUpperCase()===pattern.charAt(0) && /^\d+$/.test(pattern.charAt(0))==false){
    console.log("addresspatterns can't start with an Uppercase letter");
    process.exit()
  }
  console.log(`\nBruteforcing an address with pattern 3M... or 3N` + chalk.bold(pattern) + ` at the ${chalk.bold(location)}, case sensitive: ${chalk.bold(caseSensitivity)}`);
  calculatePossibilities(pattern, caseSensitivity);
  bruteForceStart(pattern, caseSensitivity);
} else if (location == "end") {
  console.log(`\nBruteforcing an address with pattern ` + chalk.bold(pattern) + ` at the ${chalk.bold(location)}, case sensitive: ${chalk.bold(caseSensitivity)}`);
  calculatePossibilities(pattern, caseSensitivity);
  bruteForceEnd(pattern, caseSensitivity);
} else {
  console.log("\nthere was an input error for some unknown reason.")
  process.exit()
};

module.exports = app;