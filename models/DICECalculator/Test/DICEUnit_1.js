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
const modFs = require('fs');
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

function _toHexString(byteArray) {
    return Array.from(byteArray, function (byte) {
        return ('0' + (byte & 0xFF).toString(16)).slice(-2);
    }).join('');
}

module.exports = DICEUnit;

var dice = new DICEUnit();

dice.addrOperator[0] = 3;
dice.addrMiner[0] = 3;
dice.validZeros[0] = 3;

dice.payLoad[0] = 3;


dice.addrOperator[19] = 5;
dice.addrMiner[19] = 5;
dice.validZeros[0] = 5;
dice.swatchTime[3] = 5;
dice.payLoad[82] = 5;


modFs.writeFile("./test.json", JSON.stringify(dice.toHexStringifyUnit(), null, 0), 'utf-8');