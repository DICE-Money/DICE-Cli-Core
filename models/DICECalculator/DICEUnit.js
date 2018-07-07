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

//Required 3rd-party libraries
var modBase58 = require('../Base58/Base58.js');
/* javascript-obfuscator:enable */

//Create Instance
modBase58 = new modBase58();

//Class access 
var _Method = DICEUnit.prototype;

//Constant data
const cBitCoinAdressVersion = 1;
const cBitCoinAdressCheckSum = 4;

function DICEUnit() {
    //1024bit or 128 byte Dice raw prototype
    this.addrOperator = new Uint8Array(20);
    this.addrMiner = new Uint8Array(20);
    this.validZeros = new Uint8Array(1);
    this.swatchTime = new Uint8Array(4);
    this.payLoad = new Uint8Array(83);
}

//Set methods for local variables
_Method.setMinerAddress = function (string, base58) {
    if ('bs58' !== base58) {
        this.addrMiner = _stringToUint8Array(string, this.addrMiner.length);
    } else {
        this.addrMiner = _bs58AddrToRaw(string);
    }
};

_Method.setOperatorAdress = function (string, base58) {
    if ('bs58' !== base58) {
        this.addrOperator = _stringToUint8Array(string, this.addrOperator.length);
    } else {
        this.addrOperator = _bs58AddrToRaw(string);
    }
};

_Method.setValidZeros = function (byte) {
    if (255 > byte) {
        this.validZeros[0] = byte;
    } else {
        throw "Error Invalid Vaidating zeros!";
    }
};

_Method.setSwatchTime = function (float) {
    var buf_U32 = new Uint32Array(1);
    if (null !== float.length) {
        buf_U32[0] = parseInt(Math.round(float));
        this.swatchTime = new Uint8Array(buf_U32.buffer).reverse();
    } else {
        throw "Error Invalid Swatch Time!";
    }
};

_Method.setPayload = function (Uint8Array_83) {
    if (null !== Uint8Array_83 &
            this.payLoad.length >= Uint8Array_83.length) {
        this.payLoad = new Uint8Array(Uint8Array_83);
    } else {
        throw "Error Invalid PayloadArray!";
    }
};

//Converting methods
_Method.from = function (JSONFile) {
    var DICEUnitL = JSON.parse(JSONFile);
    var buffer;

    //Set values for all class members
    buffer = new Buffer(DICEUnitL.addrOperator, "hex");
    DICEUnitL.addrOperator = (new Uint8Array(buffer));

    buffer = new Buffer(DICEUnitL.addrMiner, "hex");
    DICEUnitL.addrMiner = (new Uint8Array(buffer));

    buffer = new Buffer(DICEUnitL.validZeros, "hex");
    DICEUnitL.validZeros = (new Uint8Array(buffer));

    buffer = new Buffer(DICEUnitL.swatchTime, "hex");
    DICEUnitL.swatchTime = (new Uint8Array(buffer));

    buffer = new Buffer(DICEUnitL.payLoad, "hex");
    DICEUnitL.payLoad = (new Uint8Array(buffer));

    return DICEUnitL;
};

_Method.fromBS58 = function (bs58String) {
    var buffer = modBase58.decode(bs58String);
    
    this.addrOperator = new Uint8Array(Buffer.from(buffer.slice(0,20),'hex'));
    this.addrMiner = new Uint8Array(Buffer.from(buffer.slice(20,40),'hex'));
    this.validZeros = new Uint8Array(1);
    this.validZeros[0] = buffer[40];
    this.swatchTime = new Uint8Array(Buffer.from(buffer.slice(41,45),'hex'));
    this.payLoad = new Uint8Array(Buffer.from(buffer.slice(45,128),'hex'));
    
    return this;
};

_Method.toHexStringifyUnit = function () {
    var bufferDICE = new DICEUnit();

    //Fill up all data
    bufferDICE.addrOperator = _toHexString(this.addrOperator);
    bufferDICE.addrMiner = _toHexString(this.addrMiner);
    bufferDICE.validZeros = _toHexString(this.validZeros);
    bufferDICE.swatchTime = _toHexString(this.swatchTime);
    bufferDICE.payLoad = _toHexString(this.payLoad);

    return bufferDICE;
};

_Method.toBS58 = function () {
    var bufferDICE = "";

    //Fill up all data
    bufferDICE += _toHexString(this.addrOperator);
    bufferDICE += _toHexString(this.addrMiner);
    bufferDICE += _toHexString(this.validZeros);
    bufferDICE += _toHexString(this.swatchTime);
    bufferDICE += _toHexString(this.payLoad);

    //Encode to BS58
    var buffer = new Buffer.from(bufferDICE, 'hex');
    bufferDICE = modBase58.encode(buffer);

    return bufferDICE;
};


//Local private functions   
function _stringToUint8Array(string, sizeOfArray) {
    var stringCounter = 0;
    var bufArray = new Uint8Array(sizeOfArray);
    for (var i = (bufArray.length - 1); i >= 0; i--) {
        bufArray[i] = string.charCodeAt(stringCounter);
        stringCounter++;
    }
    return bufArray;
}

function _bs58AddrToRaw(string) {
    var bytes = modBase58.decode(string);
    var u8Array = new Uint8Array(bytes);
    return u8Array;
}

function _toHexString(byteArray) {
    return Buffer.from(byteArray.buffer).toString('hex');
}

function _bytesToHexstring(bytes) {
    var text = "";

    for (var i = 0; i < bytes.length; ++i) {
        text += _byteToHex(bytes[i]).toUpperCase();
    }

    return text;
}

function _byteToHex(b) {
    var hexChar = ["0", "1", "2", "3",
        "4", "5", "6", "7",
        "8", "9", "A", "B",
        "C", "D", "E", "F"];
    var hexValue = hexChar[(b >> 4) & 0x0f] + hexChar[b & 0x0f];

    return hexValue;
}

module.exports = DICEUnit;