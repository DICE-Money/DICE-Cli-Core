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

//Required
const modCrypto = require('crypto');
const modEc = require('elliptic').ec;

//Class access 
var _Method = Secp521k1.prototype;

function Secp521k1(keyPair) {
    this.keys = 0;
    this.ecSecp521r1 = new modEc('p521');
    this.cryptoSecp521r1 = modCrypto.createECDH("secp521r1");
    
    //Set keys
    this.setKeys(keyPair);
}

_Method.getKeyPair = function () {
    
    //Convert public uncompressed to compressed
    this.cryptoSecp521r1.setPrivateKey(this.keys.getPrivate("hex"),"hex");
    var pub = this.cryptoSecp521r1.getPublicKey(null,"compressed");

    return {private:this.keys.getPrivate(),public: pub.toString('hex')};
};

_Method.genarateKeys = function () {

    //Gen keys
    key = this.ecSecp521r1.genKeyPair();
    this.cryptoSecp521r1.setPrivateKey(key.getPrivate("hex"), "hex");
    
    //Save 
    this.keys = key;
};

_Method.sign = function(hexString){
    //Sign data
    var signature = this.keys.sign(hexString);
    
    // Export DER encoded signature in Array 
    var derSign = signature.toDER();
    
    return derSign;
};

_Method.verify = function(hexString, signature, pubKey){
    var pubKeyReal = (pubKey.toString('hex'));
    var uncompressed =  this.cryptoSecp521r1.setPublicKey(pubKeyReal,"hex").getPublicKey("hex");
    return this.ecSecp521r1.verify(hexString, signature,uncompressed,"hex");
};

_Method.setKeys = function(keyPair){       
    if (keyPair){
        this.keys = this.ecSecp521r1.keyFromPrivate(keyPair.private);
        this.cryptoSecp521r1.setPrivateKey(keyPair.private.toString('hex'),"hex");
    }
};

module.exports = Secp521k1;
