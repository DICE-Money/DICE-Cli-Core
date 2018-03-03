/* 
 * Copyright (c) 2018, Mihail Maldzhanski
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *
 * * Redistributions of source code must retain the above copyright notice, this
 *   list of conditions and the following disclaimer.
 * * Redistributions in binary form must reproduce the above copyright notice,
 *   this list of conditions and the following disclaimer in the documentation
 *   and/or other materials provided with the distribution.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
 * AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
 * IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
 * ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE
 * LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
 * CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF
 * SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS
 * INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN
 * CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)
 * ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE
 * POSSIBILITY OF SUCH DAMAGE.
 */

const secp160k1 = require('../Secp160k1.js');
const fs = require('fs');

var filePath = "./localBank.bnk.2.json";
var counter = 0;
const testCount = 100000; // 100K
const onEach = 100;       // 100
var bank = {};
try {
    console.log("Reading from bank...");
    bank = JSON.parse(fs.readFileSync(filePath));
} catch (e) {
    //Only if exist
}

var totalGood = 0;
var totalBad = 0;
var countOfElement = 0;

//Calculate percent of unused key combinations
for (const key of Object.keys(bank)) {
   totalGood += bank[key].good;
   totalBad += bank[key].bad;
   countOfElement++;
}

//Print Result
console.log("Items in Bank:",countOfElement);
console.log(`Total Good: ${totalGood} Total Bad: ${totalBad}`);
console.log(`Avg Good: ${totalGood/countOfElement} Avg Bad: ${totalBad/countOfElement}`);
console.log(`Percent Invalid: ${(totalBad/totalGood)*100}%`);

//Data for generation of Keys
console.log(`Max Unique Combinations for 159 bits: ${Math.pow(2,159)}`);
console.log(`Conclusion valid keys are ${Math.pow(2,159)} * ${(100-(totalBad/totalGood)*100)}% = ${Math.pow(2,159)*(100-(totalBad/totalGood)*100)/100}`);