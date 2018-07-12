/* javascript-obfuscator:disable */
/* 
 * Copyright 2017-2018 Mihail Maldzhanski<pollarize@gmail.com>.
 * DICE Money Ltd.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

//Required libraries
const modCrypto = require('crypto');
const modSecp160k1 = require('./Secp160k1.js');
var modBase58 = require('../Base58/Base58.js');
/* javascript-obfuscator:enable */

//Create Instance
modBase58 = new modBase58();

//Local variables
var _Method = DigitalAdressCalculator.prototype;

//Local constants 
const cCurveECDH = "secp160k1"; //Compressed output 21
const cECDH = modCrypto.createECDH(cCurveECDH);
const cLenghtOfRealAddr = 20 * 2;
const cLenghtOfAddr = cLenghtOfRealAddr + (cLenghtOfRealAddr / 5) - 1;

// Constructor
function DigitalAdressCalculator() {
    // always initialize all instance properties
    this.privateKey = "NOK";
    this.digitalAddress = "NOK";
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
    this.digitalAddress = keyPair.public.toString('hex');
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
    var digitalAddr = Buffer.from(this.digitalAddress, 'hex');

    if (format === 'bs58') {
        digitalAddr = modBase58.encode(digitalAddr);
    } else if (format === 'hex') {
        digitalAddr = this.digitalAddress;
    } else if (format === 'hexDash') {
        digitalAddr = this.convertHexToHexDash(this.digitalAddress);
    }

    return digitalAddr;
};

_Method.fromHexDash = function (keyPair) {
    try {
        this.privateKey = modBase58.decode(keyPair.privateKey);

    } catch (e) {
        this.privateKey = keyPair.privateKey.toString('hex');
    }

    //Save to Local Instance
    this.digitalAddress = this.convertHexDashToHex(keyPair.digitalAddress);

    //Return as Base 58
    return {privateKey: keyPair.privateKey, digitalAddress: this.convertHexDashToBS58(keyPair.digitalAddress)};
};

_Method.convertHexDashToBS58 = function (digitalAddr) {
    var addr = "";
    for (var i = 0; i < digitalAddr.length; i++) {
        if (digitalAddr[i] !== "-") {
            addr += digitalAddr[i];
        }
    }
    return modBase58.encode(Buffer.from(addr, "hex"));
};

_Method.convertHexDashToHex = function (digitalAddr) {
    var addr = "";
    for (var i = 0; i < digitalAddr.length; i++) {
        if (digitalAddr[i] !== "-") {
            addr += digitalAddr[i];
        }
    }
    return addr;
};


_Method.convertBS58ToHexDash = function (digitalAddr) {
    var addr = '';
    try {
        digitalAddr = modBase58.decode(digitalAddr).toString('hex');
        for (var i = 0; i < digitalAddr.length; i++) {
            if (i % 5 === 0 && i > 0) {
                addr += '-';
            }
            addr += digitalAddr[i];
        }
    } catch (e) {
        //Nothing the input is not Base 58
    }
    return addr;
};

_Method.convertBS58ToHexUnderLine = function (digitalAddr) {
    var addr = '';
    digitalAddr = modBase58.decode(digitalAddr).toString('hex');
    for (var i = 0; i < digitalAddr.length; i++) {
        if (i % 5 === 0 && i > 0) {
            addr += '_';
        }
        addr += digitalAddr[i];
    }
    return addr;
};

_Method.convertHexToHexDash = function (digitalAddr) {
    var addr = '';
    for (var i = 0; i < digitalAddr.length; i++) {
        if (i % 5 === 0 && i > 0) {
            addr += '-';
        }
        addr += digitalAddr[i];
    }
    return addr;
};

_Method.IsValidAddress = function (addr) {
    var isValid = false;
    if (addr !== undefined) {
        var temp = this.convertHexDashToHex(addr);
        if (temp.length === cLenghtOfRealAddr) {
            isValid = true;
        }
    }
    return isValid;
};

_Method.GetDALength = function () {
    return cLenghtOfAddr;
};

// export the class
module.exports = DigitalAdressCalculator;