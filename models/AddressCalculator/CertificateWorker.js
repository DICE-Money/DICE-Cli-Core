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

//Required
const modCrypto = require('crypto');
const modEc = require('elliptic').ec;
/* javascript-obfuscator:enable */

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
