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
const testCount = 490000; // 100K
const onEach = 100;       // 100
var bank = {};
try {
    bank = JSON.parse(fs.readFileSync(filePath));
} catch (e) {
    //Only if exist
}

function testCollision() {
// 1. create oject
    var digitalAdressWorker_160k1 = new secp160k1();

//2.Generate Keys
    digitalAdressWorker_160k1.genarateKeys();

//3. Print data on console
    var keys = digitalAdressWorker_160k1.getKeyPair();

//4.Save Keys to Bank
    if (!bank[keys.public]) {
        bank[keys.public] = {good: keys.good, bad: keys.bad};
    } else {
        
        //Save and get from others
        fs.writeFileSync(filePath,"Collision Not OK !!!!!!!!!!!!!!!!!!!!!!!!!! \n" + JSON.stringify(bank), 'utf8');
        
        console.log("Collision Not OK !!!!!!!!!!!!!!!!!!!!!!!!!!", counter);
        throw "ERROR";
    }

    if (counter % onEach === 0) {
        console.timeEnd("Test keys");
        //Save and get from others
        fs.writeFileSync(filePath, JSON.stringify(bank), 'utf8');

        //Start Timer Again
        console.log(counter);
        console.time("Test keys");
    } else {
        //Nothing
    }
    counter++;
}

//Run Test
for (var i = 0; i < testCount; i++) {
    testCollision();
}
console.timeEnd("Test keys");

//Save and get from others
fs.writeFileSync(filePath, JSON.stringify(bank), 'utf8');

