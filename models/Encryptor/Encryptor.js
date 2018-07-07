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


