/* 
 * Copyright (c) 2017, Mihail Maldzhanski
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


const modEnc = require('./Encryptor.js');
const crypto = require('crypto');
const modBS58 = require('bs58');


// 1. Init Key and Address
var key1="0375ad26168b0b033486d27f3a97beb795";
var add1="02072924ed209e79e8b37694f41bf4b148d3e9c1";

var key2="060bc474f79b351d921cb9dd2bdb7ea5";
var add2="030561b4bc18e3c56b80903392820d9c609b9442";

// 2. Set Secret Message
var testMsg = "Hello World!";

// 3. Create Encryptors
var enc1 = new modEnc(Buffer.from(key1,'hex'),'sect131r1',2);
var enc2 = new modEnc(Buffer.from(key2,'hex'),'sect131r1',2);

// 4. Encrypt Message with first pair & Decrypt
var encrypted1 = enc1.encryptDataPublicKey(testMsg, Buffer.from(add2, 'hex'));
var decrypted1 = enc1.decryptDataPublicKey(encrypted1, Buffer.from(add2, 'hex'));

// 5. Encrypt Message with second pair & Decrypt
var encrypted2 = enc2.encryptDataPublicKey(testMsg, Buffer.from(add1, 'hex'));
var decrypted2 = enc2.decryptDataPublicKey(encrypted2, Buffer.from(add1, 'hex'));

// 6. Decrypt first encypted bufer with second pair
var decrypted3 = enc1.decryptDataPublicKey(encrypted2, Buffer.from(add2, 'hex'));
var decrypted4 = enc2.decryptDataPublicKey(encrypted1, Buffer.from(add1, 'hex'));

// 7. Print Results
console.log("Encryted 1:" + encrypted1.toString('hex') + " to Address:" + add2);
console.log("Encryted 2:" + encrypted2.toString('hex') + " to Address:" + add1);

console.log("Decrypted 1:" + decrypted1.toString() + " with Address:" + add1);
console.log("Decrypted 2:" + decrypted1.toString() + " with Address:" + add2);

console.log("Swap addresses");

console.log("Decrypted 1:" + decrypted3.toString() + " with Address:" + add2);
console.log("Decrypted 2:" + decrypted4.toString() + " with Address:" + add1);