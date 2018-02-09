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

const secp160k1 = require('./Secp160k1.js');
const secp521r1 = require('./Secp521r1.js');

//1. Test Secp160k1
testSigning(secp160k1);

//2. Test Secp521r1
testSigning(secp521r1);

function testSigning(curve){
// 1. create oject
var digitalAdressWorker_160k1 = new curve();

//2.Generate Keys
digitalAdressWorker_160k1.genarateKeys();

//3. Print data on console
var keys = digitalAdressWorker_160k1.getKeyPair();
console.log("Keys:",JSON.stringify(keys));

//4. Sign Message
var msg = new Buffer("Hello","utf8").toString('hex');
var signature = digitalAdressWorker_160k1.sign(msg);

//5. Verify signed Message
console.log("Verification Instance 1:",digitalAdressWorker_160k1.verify(msg,signature,keys.public));

//6. Create new instance with already defined keys
var newdigitalAdressWorker_160k1 = new curve(keys);

//7. Verify with second instance
var newKeys = newdigitalAdressWorker_160k1.getKeyPair();
console.log("Verification Instance 2:",newdigitalAdressWorker_160k1.verify(msg,signature,newKeys.public));

//8. Check with different keys
var dummydigitalAdressWorker_160k1 = new curve();
dummydigitalAdressWorker_160k1.genarateKeys();
var dummyKeys = dummydigitalAdressWorker_160k1.getKeyPair();
console.log("Verification Instance 3:",dummydigitalAdressWorker_160k1.verify(msg,signature,dummyKeys.public));
}