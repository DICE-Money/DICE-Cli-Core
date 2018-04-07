/* javascript-obfuscator:disable */
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
var modCrypto = require("crypto");
/* javascript-obfuscator:enable */

//Class access 
var _Method = Encryptor.prototype;

//Local const
const cIV_LENGTH = 16; // For AES, this is always 16

//Public const
_Method.cDEFAULT_CURVE_TYPE = 'sect131r1';
_Method.cDEFAULT_CHECKSUM_SIZE = 2;

//Constructor
function Encryptor(privateKey, curveType, checkSumSize) {
    this._privateKey = _checkForNull(privateKey);
    this._ECDH = modCrypto.createECDH(_checkForNull(curveType));
    this._ECDH.setPrivateKey(this._privateKey);
    this._checkSumSize = _checkForNull(checkSumSize);
}

//Private Methods
function _Encrypt(data, sharedKey, inFormat, outFormat) {
    let iv = modCrypto.randomBytes(cIV_LENGTH);
    let cipher = modCrypto.createCipheriv('aes-256-cbc', new Buffer(sharedKey), iv);
    let encrypted = cipher.update(_SupportedFormats(data, inFormat, null));

    encrypted = Buffer.concat([iv ,encrypted, cipher.final()]);
    encrypted = _SupportedFormats(encrypted, null, outFormat);

    return encrypted;
}

function _Decrypt(data, sharedKey, inFormat, outFormat) {
    let iv = new Buffer(data.slice(0,cIV_LENGTH));
    let decipher = modCrypto.createDecipheriv('aes-256-cbc', new Buffer(sharedKey), iv);
    let decrypted = decipher.update(data.slice(cIV_LENGTH,data.length));

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

_Method.setPrivateKey = function (privateKey) {
    this._privateKey = _checkForNull(privateKey);
};

_Method.setCurveType = function (curveType) {
    this._ECDH = modCrypto.createECDH(_checkForNull(curveType));
    this._ECDH.setPrivateKey(this._privateKey);
};


module.exports = Encryptor;


