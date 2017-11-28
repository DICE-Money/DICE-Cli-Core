const SHA3_C_Addon = require('./build/Release/sha3_C_Addon');
const modSHA3_512 = require('js-sha3').sha3_512;

console.log("Test Application for SHA3 - C and JS compare");

var test = "234";
var js = "NONE";
var c = "NONE";

function PeriodicTest() {
  console.time("js sha3");
  js = modSHA3_512(test);
  console.timeEnd("js sha3");

  console.time("c sha3");
  c = SHA3_C_Addon.sha3_512(test);
  console.timeEnd("c sha3");

  //Print results
  console.log(js);
  console.log(c);
  console.log(Buffer.from(c,'hex'));
}



//Start Periodically
setInterval(PeriodicTest, 1000);