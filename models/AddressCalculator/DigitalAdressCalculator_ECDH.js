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

//Required libraries
const modCrypto = require('crypto');
const modSecp160k1 = require('./Secp160k1.js');
var modBase58 = require('../Base58/Base58.js');
modBase58 = new modBase58();

//Local variables
var _Method = DigitalAdressCalculator.prototype;

//Local constants 
const cCurveECDH = "sect131r1"; //Compressed output 17
const cECDH = modCrypto.createECDH(cCurveECDH);

// Constructor
function DigitalAdressCalculator() {
    // always initialize all instance properties
    this.privateKey = "NOK";
    this.digitalAdress = "NOK";
    this.ecSecp160k1 = new modSecp160k1();
}

//Local functions
function _SHA256(text) {
    var hash = modCrypto.
            createHash('sha256').
            update(text).
            digest('hex');

    return hash;
}

//Public methods
//Calcualte Pairs of Private Key And Public Adress
_Method.CalculateKeyAdressPair = function () {
    //Get KeyPair
    this.ecSecp160k1.genarateKeys();
    var keyPair = this.ecSecp160k1.getKeyPair();

    //Save them to local vars
    this.privateKey = keyPair.private.toString('hex');
    this.digitalAdress = keyPair.public.toString('hex');
};

//Export Get methods
_Method.getPrivateKey = function (format) {
    var privateKey = new Buffer.from(this.privateKey, 'hex');
    if (format === 'bs58') {
        privateKey = modBase58.encode(privateKey);
    } else if (format === 'hex') {
        privateKey = this.privateKey;
    } else {
        //Nothing
    }

    return privateKey;
};

_Method.getDigitalAdress = function (format) {
    var digitalAddr = Buffer.from(this.digitalAdress, 'hex');

    if (format === 'bs58') {
        digitalAddr = modBase58.encode(digitalAddr);
    } else if (format === 'hex') {
        digitalAddr = this.digitalAdress;
    } else {
        //Nothing
    }

    return digitalAddr;
};


// export the class
module.exports = DigitalAdressCalculator;