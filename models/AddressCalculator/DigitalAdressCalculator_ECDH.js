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
const modBase58 = require('bs58');

//Local variables
var _Method = DigitalAdressCalculator.prototype;

//Local constants 
const cCurveECDH = "sect131r1"; //Compressed output 17
const cECDH = modCrypto.createECDH(cCurveECDH);

// Constructor
function DigitalAdressCalculator() {
    // always initialize all instance properties
    this._privateKey = "NOK";
    this._digitalAdress = "NOK";
}

//Local functions
function _CalculatePrivateKey() {
    return cECDH.getPrivateKey('hex');
}


function _SHA256(text) {
    var hash = modCrypto.
            createHash('sha256').
            update(text).
            digest('hex');

    return hash;
}

function _CalculateDigitalAdress() {
    var pubKey = cECDH.getPublicKey('hex', 'compressed');

    var firstSHA = _SHA256(pubKey);

    var doubleSHA = _SHA256(firstSHA);

    var addressChecksum = doubleSHA.substr(0, 4);

    var unEncodedAddress = pubKey + addressChecksum;

    return unEncodedAddress;
}

//Public methods

//Calcualte Pairs of Private Key And Public Adress
_Method.CalculateKeyAdressPair = function () {
    cECDH.generateKeys();

    //GenerateRaw
    this._privateKey = _CalculatePrivateKey();
    this._digitalAdress = _CalculateDigitalAdress();
};

//Export Get methods
_Method.getPrivateKey = function (format) {
    var privateKey = new Buffer.from(this._privateKey, 'hex');

    if (format === 'bs58') {
        privateKey = modBase58.encode(privateKey);
    } else if (format === 'hex') {
        privateKey = this._privateKey;
    } else {
        //Nothing
    }

    return privateKey;
};

_Method.getDigitalAdress = function (format) {
    var digitalAddr = Buffer.from(this._digitalAdress, 'hex');

    if (format === 'bs58') {
        digitalAddr = modBase58.encode(digitalAddr);
    } else if (format === 'hex') {
        digitalAddr = this._digitalAdress;
    } else {
        //Nothing
    }

    return digitalAddr;
};


// export the class
module.exports = DigitalAdressCalculator;