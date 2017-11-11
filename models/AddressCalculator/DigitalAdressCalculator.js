/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

//Require crypto library set
const modCrypto = require('crypto');
const modRIPEMD160 = require('ripemd160');
const modBase58 = require('bs58');
const modElipticCurve = require('elliptic-curve').secp256k1;
const modConvertHex = require('convert-hex');

//Local variables
var _Method = DigitalAdressCalculator.prototype;

// Constructor
function DigitalAdressCalculator() {
    // always initialize all instance properties
    this._privateKey = "NOK";
    this._digitalAdress = "NOK";
}

//Local functions
function _CalculatePrivateKey() {

    //Generate randowm values
    var buf = modCrypto.randomBytes(32);
    var privateKeyBytes = "";

    for (var i = 0; i < buf.length; ++i) {
        privateKeyBytes += _byteToHex(buf[i]).toUpperCase();
    }

    return privateKeyBytes;
}
;

function _TransformToWIF(privateKeyHex) {

    //For More information check 
    //https://en.bitcoin.it/wiki/List_of_address_prefixes
    var privateKeyAndVersion = "80" + privateKeyHex;
    var firstSHA = _SHA256(privateKeyAndVersion);
    var secondSHA = _SHA256(firstSHA);
    var checksum = secondSHA.substr(0, 8).toUpperCase();

    //append checksum to end of the private key and version
    var keyWithChecksum = privateKeyAndVersion + checksum;
    var keyWithChecksumBytes = Buffer.from(keyWithChecksum, 'hex');
    var privateKeyWIF = modBase58.encode(keyWithChecksumBytes);

    return privateKeyWIF;
}

function _byteToHex(b) {
    var hexChar = ["0", "1", "2", "3",
        "4", "5", "6", "7",
        "8", "9", "A", "B",
        "C", "D", "E", "F"];
    var hexValue = hexChar[(b >> 4) & 0x0f] + hexChar[b & 0x0f];

    return hexValue;
}

function _hexStringToBytesString(hex) {
    var text = "";
    text = Buffer.from(hex, 'hex');
    return text;
}

function _bytesToHexstring(bytes) {
    var text = "";

    for (var i = 0; i < bytes.length; ++i) {
        text += _byteToHex(bytes[i]).toUpperCase();
    }

    return text;
}

function _SHA256(text) {
    var hash = modCrypto.
            createHash('sha256').
            update(text).
            digest('base64');

    return hash;
}

function _CalculateDigitalAdress(privateKey) {
    var publicKey = modElipticCurve.getPublicKey(privateKey, 'hex');

    //could use publicKeyBytesCompressed as well
    var hash160 = new modRIPEMD160().update(publicKey).digest('hex');

    var version = (0x00); //if using testnet, would use 0x6F or 111.
    var hashAndBytes = modConvertHex.hexToBytes(hash160);
    hashAndBytes.unshift(version);

    var firstSHA = _SHA256(hashAndBytes.toString('hex'));

    var doubleSHA = _SHA256(firstSHA);

    var addressChecksum = doubleSHA.substr(0, 8);

    var unEncodedAddress = "00" + hash160 + addressChecksum;

    var address = modBase58.encode(_hexStringToBytesString(unEncodedAddress));
    return address;
}
;

//Public methods
_Method.Alive = function () {
    console.log("Hello NodeJS - Adress Worker");
};

//Calcualte Pairs of Private Key And Public Adress
_Method.CalculateKeyAdressPair = function () {
    this._privateKey = _CalculatePrivateKey();
    this._digitalAdress = _CalculateDigitalAdress(this._privateKey);
    this._privateKey = _TransformToWIF(this._privateKey);
};

//Export Get methods
_Method.getPrivateKey = function () {
    return this._privateKey;
};

_Method.getDigitalAdress = function () {
    return this._digitalAdress;
};


// export the class
module.exports = DigitalAdressCalculator;