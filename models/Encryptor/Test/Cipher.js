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
var crypto = require("crypto");
const assert = require('assert');
const modRIPEMD160 = require('ripemd160');
const modBase58 = require('bs58');
const zlib = require('zlib');

// Generate Alice's keys...
const alice = crypto.createECDH('secp521r1');
const aliceKeys = alice.generateKeys();
const aliceKey = alice.getPublicKey(null, "compressed");

// Generate Bob's keys...
const bob = crypto.createECDH('secp521r1');
const bobKeys = bob.generateKeys();
const bobKey = bob.getPublicKey(null, "compressed");

// Generate Tracey's keys...
const tracey = crypto.createECDH('secp521r1');
const traceyKeys = tracey.generateKeys();

//console.log(alice.getPublicKey().toString("base64"));
//console.log(alice.getPrivateKey().toString("base64"));

// Exchange and generate the secret...
const aliceSecret = alice.computeSecret(bobKey);
const bobSecret = bob.computeSecret(aliceKey);
const traceySecret = tracey.computeSecret(aliceKey);

//console.log(aliceSecret.length);
//console.log(aliceSecret.toString('hex'),"\n" + bobSecret.toString('hex'),"\n" + traceySecret.toString('hex'));
// OK

const mihail = crypto.createECDH('secp521r1');
mihail.setPrivateKey('L5QnNSWiad3T96sVrpAraCQNRnS4sJsHF5Vn6F2DDKBm5BPLrays');
const mihailKey = mihail.getPublicKey(null,'compressed');

const input = mihailKey;


zlib.deflate(input,{ windowBits: 14, memLevel: 9 }, (err, buffer) => {
  if (!err) {
    console.log(buffer.length);
  } else {
    // handle error
  }
});

const buffer = Buffer.from('eJzT0yMAAGTvBe8=', 'base64');
zlib.unzip(buffer, (err, buffer) => {
  if (!err) {
    console.log(buffer.toString());
  } else {
    // handle error
  }
});
//var ciphers = crypto.getCiphers();

//for (var i = 0; i < ciphers.length; i++) {
// try{
//    const cipher = crypto.createCipher(ciphers[i], _SHA256(mihailKey));
//    let encrypted = cipher.update(mihailKey);
//    encrypted += cipher.final();
//    
//    var lenght = encrypted.length;
//    if (lenght <= 60)
//    {
//        console.log(ciphers[i], lenght);
//    }
//}catch (e)
//{
//    
//}
//}
//

console.log(mihailKey.length);
console.log(mihailKey.toString("base64"));

function _SHA256(text) {
    var hash = crypto.
            createHash('sha256').
            update(text).
            digest();

    return hash;
}



const ENCRYPTION_KEY = _SHA256(mihailKey); // Must be 256 bytes (32 characters)
const IV_LENGTH = 16; // For AES, this is always 16

function encrypt(text) {
 let iv = crypto.randomBytes(IV_LENGTH);
 let cipher = crypto.createCipheriv('aes-256-cbc', new Buffer(ENCRYPTION_KEY), iv);
 let encrypted = cipher.update(text);

 encrypted = Buffer.concat([encrypted, cipher.final()]);

 return iv.toString('hex') + ':' + encrypted.toString('hex');
}

function decrypt(text) {
 let textParts = text.split(':');
 let iv = new Buffer(textParts.shift(), 'hex');
 let encryptedText = new Buffer(textParts.join(':'), 'hex');
 let decipher = crypto.createDecipheriv('aes-256-cbc', new Buffer(ENCRYPTION_KEY), iv);
 let decrypted = decipher.update(encryptedText);

 decrypted = Buffer.concat([decrypted, decipher.final()]);

 return decrypted.toString('base64');
}
var en = encrypt(mihailKey);
console.log(en);
console.log(decrypt(en));