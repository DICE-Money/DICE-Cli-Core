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
var _Method = Secp160k1.prototype;

//Local const
const cSizeOfDA = 20;
const cMinimuLengthOfPrivateKey = 7;
const cLastThreeBitValue = 7;        // Represents 111 Binary
const cPlusSign = "2";
const cMinusSign = "3";

function Secp160k1(keyPair) {
    this.keys = 0;
    this.ecSecp160k1 = new modEc('p160');
    this.cryptoSecp160k1 = modCrypto.createECDH("secp160k1");

    //Set keys
    this.setKeys(keyPair);
}

_Method.getKeyPair = function () {

    //Convert public uncompressed to compressed
    this.cryptoSecp160k1.setPrivateKey(this.keys.getPrivate("hex"), "hex");
    var pub = this.cryptoSecp160k1.getPublicKey(null, "compressed");

    return {private: this.keys.getPrivate(), public: this.compressPublicKey(pub)};
};

_Method.genarateKeys = function () {
    var isReady = true;
    var pub, key;

    do {
        key = this.ecSecp160k1.genKeyPair();
        this.cryptoSecp160k1.setPrivateKey(key.getPrivate("hex"), "hex");
        pub = this.cryptoSecp160k1.getPublicKey(null, "compressed").toString("hex");

        if (pub[cSizeOfDA * 2 + 1] <= cLastThreeBitValue) {
            if (key.getPrivate().length === cMinimuLengthOfPrivateKey) {
                isReady = false;
            }
        }
    } while (isReady)

    //Save 
    this.keys = key;
};

_Method.sign = function (hexString) {
    //Sign data
    var signature = this.keys.sign(hexString.toString("hex"));

    // Export DER encoded signature in Array 
    var derSign = signature.toDER();

    return derSign;
};

_Method.verify = function (hexString, signature, pubKey) {
    var pubKeyReal = this.deCompressPublicKey(pubKey);
    var tempCryptoSecp160k1 = new modCrypto.createECDH("secp160k1");
    var uncompressed = tempCryptoSecp160k1.setPublicKey(pubKeyReal, "hex").getPublicKey("hex");
    return this.ecSecp160k1.verify(hexString.toString("hex"), signature, uncompressed, "hex");
};

_Method.setKeys = function (keyPair) {
    if (keyPair) {
        this.keys = this.ecSecp160k1.keyFromPrivate(keyPair.private);
        this.cryptoSecp160k1.setPrivateKey(keyPair.private.toString('hex'), "hex");
    }
};

_Method.getCryptoInstance = function () {
    return this.cryptoSecp160k1;
};

_Method.computeSecret = function (pubKey) {
    var pubKeyReal = this.deCompressPublicKey(pubKey);
    return this.cryptoSecp160k1.computeSecret(pubKeyReal, "hex");
};

_Method.compressPublicKey = function (pubKey) {
    var pub = pubKey.toString("hex");
    var address = "";
    var secondFourBits = pub[1];
    var lastFourBits = pub[cSizeOfDA * 2 + 1];

    if (secondFourBits === cMinusSign)
    {
        address = dec2bin(lastFourBits);
        address = address + "1";
        while (address.length < 4)
        {
            address = "0" + address;
        }
    } else
    {
        address = dec2bin(lastFourBits);
        address = address + "0";
        while (address.length < 4)
        {
            address = "0" + address;
        }
    }
    address = bin2dec(address).toString(16) + pub.slice(2, cSizeOfDA * 2 + 1);
    return address;
};

_Method.deCompressPublicKey = function (pubKey) {
    var pub = pubKey.toString("hex");
    var address = "";
    var firstFourBits = pub[0];
    var sign = 0;
    var lastFourBits = 0;

    address = hex2bin(firstFourBits);
    while (address.length < 4)
    {
        address = "0" + address;
    }

    if (address[address.length - 1] === "1") {
        sign = cMinusSign;
    } else {
        sign = cPlusSign;
    }

    lastFourBits = bin2dec(address.slice(0, address.length - 1));

    address = `0${sign}${pub.slice(1, pubKey.length)}${lastFourBits.toString(16)}`;
    return address;
};

function dec2bin(dec) {
    return (dec >>> 0).toString(2);
}

function bin2dec(binary) {
    return parseInt(binary, 2);
}

function hex2bin(hex) {
    var dec = parseInt(hex, 16);
    return dec.toString(2);
}
module.exports = Secp160k1;
