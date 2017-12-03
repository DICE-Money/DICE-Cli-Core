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

//Required 3rd-party libraries
const modBase58 = require('bs58');

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
        console.log();
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
        this.payLoad = Uint8Array_83;
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

function _reverseUint8ArrayBytes(array) {
    var arrayCounter = 0;
    var bufArray = new Uint8Array(array.length);
    for (var i = (bufArray.length - 1); i >= 0; i--) {
        bufArray[i] = array[arrayCounter];
        arrayCounter++;
    }
    return bufArray;
}

function _toHexString(byteArray) {
    return Array.from(byteArray, function (byte) {
        return ('0' + (byte & 0xFF).toString(16)).slice(-2);
    }).join('');
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