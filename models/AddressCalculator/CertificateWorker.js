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
var _Method = CertificateWorker.prototype;

const cCurveLow = "256";
const cCurveMid = "384";
const cCurveHigh = "521";

const cCurveLow_Crypto = "256k1";
const cCurveMid_Crypto = "384r1";
const cCurveHigh_Crypto = "521r1";

function CertificateWorker(securityLevel, keyPair) {
    this.keys = 0;

    //set security
    this.setSecurity(securityLevel);

    //Set keys
    this.setKeys(keyPair);
}

_Method.getKeyPair = function () {

    //Convert public uncompressed to compressed
    this.cryptoSecp.setPrivateKey(this.keys.getPrivate("hex"), "hex");
    var pub = this.cryptoSecp.getPublicKey(null, "compressed");

    return {private: this.keys.getPrivate(), public: pub.toString('hex')};
};

_Method.getCertificate = function () {
    return this.cryptoSecp.getPublicKey(null, "compressed").toString('hex');
};

_Method.genarateKeys = function () {

    //Gen keys
    key = this.ecSecp.genKeyPair();
    this.cryptoSecp.setPrivateKey(key.getPrivate("hex"), "hex");

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
    var pubKeyReal = (pubKey.toString('hex'));
    var tempCryptoSecp521r1 = new modCrypto.createECDH(`secp${this.curve}`);
    var uncompressed = tempCryptoSecp521r1.setPublicKey(pubKeyReal, "hex").getPublicKey("hex");
    return this.ecSecp.verify(hexString.toString('hex'), signature, uncompressed, "hex");
};

_Method.setKeys = function (keyPair) {
    if (keyPair) {
        this.keys = this.ecSecp.keyFromPrivate(keyPair.private);
        this.cryptoSecp.setPrivateKey(keyPair.private.toString('hex'), "hex");
    }
};

_Method.setSecurity = function (securityLevel) {
    switch (securityLevel) {
        case "heavy":
        default:
            this.curve = cCurveHigh_Crypto;
            this.ecSecp = new modEc(`p${cCurveHigh}`);
            this.cryptoSecp = new modCrypto.createECDH(`secp${cCurveHigh_Crypto}`);
            break;
            
        case "advanced":
            this.curve = cCurveMid_Crypto;
            this.ecSecp = new modEc(`p${cCurveMid}`);
            this.cryptoSecp = new modCrypto.createECDH(`secp${cCurveMid_Crypto}`);
            break;
            
        case "general":
            this.curve = cCurveLow_Crypto;
            this.ecSecp = new modEc(`secp${cCurveLow}k1`);
            this.cryptoSecp = new modCrypto.createECDH(`secp${cCurveLow_Crypto}`);
            break;
    }
};


_Method.getCryptoInstance = function () {
    return this.cryptoSecp;
};

_Method.computeSecret = function (pubKey) {
    return this.cryptoSecp.computeSecret(pubKey.toString("hex"), "hex");
};

module.exports = CertificateWorker;
