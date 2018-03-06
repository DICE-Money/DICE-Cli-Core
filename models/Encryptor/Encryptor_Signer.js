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
const certificateWorker = require("../AddressCalculator/CertificateWorker.js");

//Class access 
var _Method = Encryptor.prototype;

//Local const
const cIV_LENGTH = 16; // For AES, this is always 16
const cAUTH_TAG_LENGTH = 32; // For GCM, is always 32
const cErrorLevel_1 = 1;
const cErrorLevel_2 = 2;
const cErrorLevel_3 = 3;
const cAlgorithm = 'aes-256-gcm';

//Constructor
function Encryptor(keyPair, security) {

    //Init component with already known keys
    this._160k1 = new modSecp160k1(_checkForNull(keyPair));

    //Set Security
    _Method.setSecurityLevel(security);

    //Hold Big Certificate
    this._certificateBank = {digitalAddress: undefined, certificate: undefined};
}

//Private Methods
function _Encrypt(data, sharedKey) {
    var bufData = new Buffer.from(data);
    let iv = modCrypto.randomBytes(cIV_LENGTH);
    var cipher = modCrypto.createCipheriv(cAlgorithm, sharedKey, iv);
    var encrypted = cipher.update(bufData.toString("hex"), 'hex', 'hex');
    encrypted += cipher.final('hex');
    var tag = cipher.getAuthTag();
    var returnData = {
        iv: iv.toString("base64"),
        content: Buffer.from(encrypted, "hex").toString("base64"),
        tag: tag.toString("base64")
    };
    return Buffer.from(JSON.stringify(returnData), "utf8").toString("base64");
}

function _Decrypt(data, sharedKey) {
    var encrypted = JSON.parse(Buffer.from(data, "base64").toString("utf8"));
    var decipher = modCrypto.createDecipheriv(cAlgorithm, sharedKey, Buffer.from(encrypted.iv, "base64"));
    decipher.setAuthTag(Buffer.from(encrypted.tag, "base64"));
    var decrypted = decipher.update(encrypted.content, 'base64', 'utf8');
    decrypted += decipher.final('utf8');
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

//Public Methods
_Method.encryptDataPublicKey = function (toEncrypt, publicKey) {

    //Check for existing certificate
    if (this._certificateBank[publicKey] !== undefined) {
        certificate = this._certificateBank[publicKey];
    } else {
        return "Invalid public Key";
    }

    //1. Prepare secret
    var sharedKey = this.certWorker.computeSecret(certificate);

    //2. Sign with small key
    var smallSignature = this._160k1.sign(toEncrypt);

    //3. Sign data and signature with big key
    var dataAndSmallSignature = {data: toEncrypt, sign: smallSignature};
    var dataAndBigSignature = this.certWorker.sign(JSON.stringify(dataAndSmallSignature));

    //4. Return encetypted data with two signatures
    return _Encrypt(JSON.stringify({data: dataAndSmallSignature, sign: dataAndBigSignature}), _SHA256(sharedKey), null, null);
};

_Method.decryptDataPublicKey = function (toDecrypt, publicKey) {

    var decryptedAndVerifiedData = undefined;

    //Check for existing certificate
    if (this._certificateBank[publicKey] !== undefined) {
        certificate = this._certificateBank[publicKey];
    } else {
        return "Invalid public Key";
    }

    //1. Prepare secret 
    var sharedKey = this.certWorker.computeSecret(certificate);

    //2. Decrypt data and parse it to object
    var decryptedData = JSON.parse(_Decrypt(toDecrypt, _SHA256(sharedKey), null, null));

    //3. Verify is signed with private key of publicKey (Big)
    if (false !== this.certWorker.verify(JSON.stringify(decryptedData.data), decryptedData.sign, certificate)) {

        //4. Verify is signed with private key of publicKey (Big)
        if (false !== this._160k1.verify(decryptedData.data.data, decryptedData.data.sign, publicKey)) {
            decryptedAndVerifiedData = decryptedData.data.data;
        } else {
            return cErrorLevel_2;
        }
    } else {
        return cErrorLevel_1;
    }

    //5. Return decrypted data
    return decryptedAndVerifiedData;
};

_Method.encryptFilePublicKey = function (toEncrypt, publicKey) {
    var sharedKey = this._160k1.computeSecret(publicKey);
    return _Encrypt(toEncrypt, _SHA256(sharedKey), null, null);
};

_Method.decryptFilePublicKey = function (toDecrypt, publicKey) {
    var sharedKey = this._160k1.computeSecret(publicKey);
    return _Decrypt(toDecrypt, _SHA256(sharedKey), null, null);
};

_Method.setPrivateKey = function (keyPair) {
    //Init component with already known keys
    this._160k1 = new modSecp160k1(keyPair);
};

_Method.setSecurityLevel = function (security) {
    //Create unique key pair for big keys
    this.certWorker = new certificateWorker(security);
    this.certWorker.genarateKeys();
};

_Method.getKeyExchangeCertificate = function (publicKey) {
    //1. Prepare sectret
    var sharedKey = this._160k1.computeSecret(publicKey);

    //2. Prepare certificate and sign it with small key
    var bigCertificate = this.certWorker.getCertificate();
    var bigCertSignature = this._160k1.sign(bigCertificate);

    //3. Sign bigCertificate with big key
    var bigCertWithSiganture = {cert: bigCertificate, sign: bigCertSignature};
    var bigCertSignPairSignature = this.certWorker.sign(JSON.stringify(bigCertWithSiganture));

    //4. Last Sign everything with small key
    var lastSignedData = {cert: bigCertWithSiganture, sign: bigCertSignPairSignature};
    var lastSignedDataSignature = this._160k1.sign(lastSignedData);

    //5. Return encrypted data
    return _Encrypt(JSON.stringify({cert: lastSignedData, sign: lastSignedDataSignature}), _SHA256(sharedKey), null, null);
};

_Method.acceptKeyExchangeCertificate = function (signedCertificate, publicKey) {
    //1. Prepare sectret
    var sharedKey = this._160k1.computeSecret(publicKey);

    //2. Decrypt data
    var decryptedData = JSON.parse(_Decrypt(signedCertificate, _SHA256(sharedKey), null, null));

    //3. Verify is signed with private key of publicKey (Small)
    if (false !== this._160k1.verify(decryptedData.cert, decryptedData.sign, publicKey)) {

        //4. Verify is signed with private key of publicKey (Big)
        if (false !== this.certWorker.verify(JSON.stringify(decryptedData.cert.cert), decryptedData.cert.sign, decryptedData.cert.cert.cert)) {

            //5. Verify is signed with private key of publicKey (Small)
            if (false !== this._160k1.verify(decryptedData.cert.cert.cert, decryptedData.cert.cert.sign, publicKey)) {
                this._certificateBank[publicKey] = decryptedData.cert.cert.cert;
            } else {
                return cErrorLevel_3;
            }
        } else {
            return cErrorLevel_2;
        }
    } else {
        return cErrorLevel_1;
    }

    return this._certificateBank[publicKey];
};

_Method.removeOldCertificate = function (publicKey) {
    try {
        delete this._certificateBank[publicKey.toString("utf8")];
    } catch (e) {
        //The operation was invalid but there is no action needed
    }
};

_Method.IsBankEmpty = function () {
    return Object.keys(this._certificateBank).length === 2;
};

module.exports = Encryptor;


