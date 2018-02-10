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
const big = require('bn.js');
const crypto = require('crypto');

var EC = require('elliptic').ec;
 
// Create and initialize EC context 
// (better do it once and reuse it) 
var ec = new EC('p160');
cSecp192 = crypto.createECDH("secp160k1");
cSecp192.generateKeys();
cECDH = crypto.createECDH("secp160k1");
cECDH.generateKeys();
var key = ec.genKeyPair();

 
// Sign message (must be an array, or it'll be treated as a hex sequence) 
var msg = [ 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10 ];
var signature = key.sign(msg);
 
// Export DER encoded signature in Array 
var derSign = signature.toDER();

Y = key.getPublic().getY();
X = key.getPublic().getX();

var publicKey = key.getPublic();

var key2 = ec.keyFromPublic(publicKey);

console.log(ec.verify(msg, derSign,publicKey),publicKey);
console.log(key.getPrivate('hex'));
console.log(cECDH.getPrivateKey('hex'));

cECDH.setPrivateKey(key.getPrivate('hex'),"hex");

console.log(cECDH.getPublicKey("hex"));
console.log(key.getPublic("hex"));
console.log(cECDH.getPublicKey('hex',"compressed"));

console.log(cSecp192.getPublicKey('hex','compressed').length/2);

var isReady = false;
var pub;

do{
    cSecp192.generateKeys();
    pub = cSecp192.getPublicKey(null,"compressed");
    isReady = true;
    for (var i = pub.length-1; i > 19 ;i-- )
    {
        if (pub[i] !== 0)
        {
            isReady =false;
        }       
    }
    
}while(!isReady)
    
console.log(pub);