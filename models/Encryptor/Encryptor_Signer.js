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
const modCrypto = require("crypto");
const modSecp160k1 = require("../AddressCalculator/Secp160k1.js");
const modSecp521r1 = require("../AddressCalculator/Secp521r1.js");

//Class access 
var _Method = Encryptor.prototype;

//Local const
const cIV_LENGTH = 16; // For AES, this is always 16

//Public const

//Constructor
function Encryptor(keyPair) {

    //Init component with already known keys
    this._160k1 = new modSecp160k1(keyPair);

    //Create unique key pair for big keys
    this._521r1 = new modSecp521r1();
    this._521r1.genarateKeys();

//    this._privateKey = _checkForNull(privateKey);
//    this._ECDH = modCrypto.createECDH(_checkForNull(curveType));
//    this._ECDH.setPrivateKey(this._privateKey);
//    this._checkSumSize = _checkForNull(checkSumSize);
}

//Private Methods
function _Encrypt(data, sharedKey, inFormat, outFormat) {
    let iv = modCrypto.randomBytes(cIV_LENGTH);
    let cipher = modCrypto.createCipheriv('aes-256-cbc', new Buffer(sharedKey), iv);
    let encrypted = cipher.update(_SupportedFormats(data, inFormat, null));

    encrypted = Buffer.concat([iv, encrypted, cipher.final()]);
    encrypted = _SupportedFormats(encrypted, null, outFormat);

    return encrypted;
}

function _Decrypt(data, sharedKey, inFormat, outFormat) {
    let iv = new Buffer(data.slice(0, cIV_LENGTH));
    let decipher = modCrypto.createDecipheriv('aes-256-cbc', new Buffer(sharedKey), iv);
    let decrypted = decipher.update(data.slice(cIV_LENGTH, data.length));

    decrypted = Buffer.concat([decrypted, decipher.final()]);
    decrypted = _SupportedFormats(decrypted, null, outFormat);

    return decrypted;
}

function _checkForNull(data) {
    if (data === null) {
        throw "Cannot be Null !";
    }
    return data;
}

function _SHA256(text) {
    var hash = modCrypto.
            createHash('sha256').
            update(text).
            digest();

    return hash;
}

function _SupportedFormats(data, inputEncoding, outputEncoding) {
    var returnType = new Buffer.from(data, inputEncoding);

    switch (outputEncoding) {
        case 'base64':
            returnType.toString('base64');
            break;
        case 'hex':
            returnType.toString('hex');
            break;
        case 'utf8':
            returnType.toString('utf8');
            break;
        default:
            //Nothing
            break;
    }

    return returnType;
}

//Public Methods
_Method.encryptDataPublicKey = function (toEncrypt, publicKey) {
    var sharedKey = this._ECDH.computeSecret(publicKey.slice(0, publicKey.length - this._checkSumSize));
    return _Encrypt(toEncrypt, _SHA256(sharedKey), null, null);
};

_Method.decryptDataPublicKey = function (toDecrypt, publicKey) {
    var sharedKey = this._ECDH.computeSecret(publicKey.slice(0, publicKey.length - this._checkSumSize));
    return _Decrypt(toDecrypt, _SHA256(sharedKey), null, null);
};

_Method.setPrivateKey = function (keyPair) {
    //Init component with already known keys
    this._160k1 = new modSecp160k1(keyPair);
};

_Method.getKeyExchangeCerificate = function (publicKey) {
    //1. Prepare sectret
    var sharedKey = this._160k1.getCryptoInstance().computeSecret(publicKey.toString("hex") + "00", "hex");

    //2. Prepare certificate and sign it with small key
    var bigCertificate = this._521r1.getCertificate();
    var bigCertSignature = this._160k1.sign(bigCertificate);

    //3. Sign bigCertificate with big key
    var bigCertWithSiganture = {cert: bigCertificate, sign: bigCertSignature};
    var bigCertSignPairSignature = this._521r1.sign(JSON.stringify(bigCertWithSiganture));

    //4. Last Sign everything with small key
    var lastSignedData = {cert: bigCertWithSiganture, sign: bigCertSignPairSignature};
    var lastSignedDataSignature = this._160k1.sign(lastSignedData);

    //5. Return encrypted data
    return _Encrypt(JSON.stringify({cert: lastSignedData, sign: lastSignedDataSignature}), _SHA256(sharedKey), null, null);
};

_Method.acceptKeyExchangeCertificate = function (signedCertificate, publicKey) {
    // By default certificate is invalid
    var bigCertificate = null;

    //1. Prepare sectret
    var sharedKey = this._160k1.getCryptoInstance().computeSecret(publicKey.toString("hex") + "00", "hex");

    //2. Decrypt data
    var decryptedData = JSON.parse(_Decrypt(signedCertificate, _SHA256(sharedKey), null, null));

    //3. Verify is signed with private key of publicKey (Small)
    if (false !== this._160k1.verify(decryptedData.cert, decryptedData.sign, publicKey)) {

        //4. Verify is signed with private key of publicKey (Big)
        if (false !== this._521r1.verify(JSON.stringify(decryptedData.cert.cert), decryptedData.cert.sign, decryptedData.cert.cert.cert)) {

            //5. Verify is signed with private key of publicKey (Small)
            if (false !== this._160k1.verify(decryptedData.cert.cert.cert, decryptedData.cert.cert.sign, publicKey)) {
                bigCertificate = decryptedData.cert.cert.cert;
            } else {
                console.log("3. Data is not signed witn private key of 160k1 curve");
            }
        } else {
            console.log("2. Data is not signed witn private key of 521r1 curve");
        }
    } else {
        console.log("1. Data is not signed witn private key of 160k1 curve");
    }

    return bigCertificate;
};

module.exports = Encryptor;


