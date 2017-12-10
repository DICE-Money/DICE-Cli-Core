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

var _Method = DICEPrototype.prototype;

function DICEPrototype() {
    //1024bit or 128 byte Dice raw prototype
    this.addrOperator = new Uint8Array(20);
    this.addrMiner = new Uint8Array(20);
    this.validZeros = new Uint8Array(1);
    this.swatchTime = new Uint8Array(4);
    this.SHA3PayLoad = new Uint8Array(64);
}

_Method.fromDICEUnit = function (diceUnit) {
    this.addrOperator = diceUnit.addrOperator;
    this.addrMiner = diceUnit.addrMiner;
    this.validZeros = diceUnit.validZeros;
    this.swatchTime = diceUnit.swatchTime;
};

_Method.setSHA3PayLoad = function (SHA3PayLoad) {
    if (null !== SHA3PayLoad) {
        var buffer = new Buffer(SHA3PayLoad, "hex");
        this.SHA3PayLoad = new Uint8Array(buffer);
    } else {
        throw "Error Invalid SHAPayloadArray!";
    }
};

_Method.setSwatchTime = function (SwatchTime) {
    if (null !== SwatchTime) {
        this.swatchTime = SwatchTime;
    } else {
        throw "Error Invalid SwatchTime!";
    }
};

/**
 * Creates a new Uint8Array based on all data in Current Prototype
 *
 * @public
 * @param None
 * @return {Uint8Array} All data concatenated.
 */
_Method.toUint8Array = function () {
    var bufArray = new Uint8Array(
            this.addrOperator.byteLength +
            this.addrMiner.byteLength +
            this.validZeros.byteLength +
            this.swatchTime.byteLength +
            this.SHA3PayLoad.byteLength);

    bufArray.set(new Uint8Array(this.addrOperator.buffer), 0);
    bufArray.set(new Uint8Array(this.addrMiner.buffer), this.addrOperator.byteLength);
    bufArray.set(new Uint8Array(this.validZeros.buffer), this.addrMiner.byteLength);
    bufArray.set(new Uint8Array(this.swatchTime.buffer), this.validZeros.byteLength);
    bufArray.set(new Uint8Array(this.SHA3PayLoad.buffer), this.swatchTime.byteLength);

    return bufArray;
};

_Method.fromBS58 = function (bs58String) {
    var buffer = modBase58.decode(bs58String);
    
    this.addrOperator = new Uint8Array(Buffer.from(buffer.slice(0,20),'hex'));
    this.addrMiner = new Uint8Array(Buffer.from(buffer.slice(20,40),'hex'));
    this.validZeros = new Uint8Array(1);
    this.validZeros[0] = buffer[40];
    this.swatchTime = new Uint8Array(Buffer.from(buffer.slice(41,45),'hex'));
    this.SHA3PayLoad = new Uint8Array(Buffer.from(buffer.slice(45,109),'hex'));
    
    return this;
};

_Method.toBS58 = function () {
    var bufferDICE = "";

    //Fill up all data
    bufferDICE += _toHexString(this.addrOperator);
    bufferDICE += _toHexString(this.addrMiner);
    bufferDICE += _toHexString(this.validZeros);
    bufferDICE += _toHexString(this.swatchTime);
    bufferDICE += _toHexString(this.SHA3PayLoad);

    //Encode to BS58
    var buffer = new Buffer.from(bufferDICE, 'hex');
    bufferDICE = modBase58.encode(buffer);

    return bufferDICE;
};

//Local private functions   
function _toHexString(byteArray) {
    return Buffer.from(byteArray.buffer).toString('hex');
}
module.exports = DICEPrototype;