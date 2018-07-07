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

//Create Isntance
modBase58 = new modBase58();

var _Method = DICEPrototype.prototype;

/**
 * General Use constructor of DICE Prototype.
 * @author Mihail Maldzhanski <pollarize@gmail.com>
 * @example
 * const modDICECalculator = require('<path>/DICEPrototype.js'); 
 * var DICEProto = new DICEPrototype();
 * var DICEUnit = DICECalc.getValidDICE_CUDA(addrOp, addrMin, zeroes, pathToCuda, "cudaJsUnit.json");
 * DICEProto.fromDICEUnit(DICEUnit);
 * var sha3Payload = DICECalc.CalculateSHA3_512(Buffer.from(DICEUnit.payload,buffer));
 * DICEProto.setSHA3PayLoad(sha3Payload);
 * @constructor
 * @return {DICEPrototype} instance
 */
function DICEPrototype() {
    //1024bit or 128 byte Dice raw prototype
    this.addrOperator = new Uint8Array(20);
    this.addrMiner = new Uint8Array(20);
    this.validZeros = new Uint8Array(1);
    this.swatchTime = new Uint8Array(4);
    this.SHA3PayLoad = new Uint8Array(64);
}

/**
 * Set data drom DICEUnit
 * @memberOf DICEPrototype
 * @function
 * @name fromDICEUnit - Already calculated DICE Unit
 * @param {DICEUnit} diceUnit
 * @return {None}
 */
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
    bufArray.set(new Uint8Array(this.addrMiner.buffer), 20);
    bufArray.set(new Uint8Array(this.validZeros.buffer), 40);
    bufArray.set(new Uint8Array(this.swatchTime.buffer), 41);
    bufArray.set(new Uint8Array(this.SHA3PayLoad.buffer), 45);

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