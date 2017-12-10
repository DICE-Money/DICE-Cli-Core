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
const modCrypto = require('crypto');
const modSHA3_C = require('../SHA-3_C/build/Release/sha3_C_Addon');
const modSHA3 = require('js-sha3');
const modSwatchTimer = require('../SwatchBeats/SwatchTimer.js');
const modDICEUnit = require('./DICEUnit.js');
const modDICEPrototype = require('./DICEPrototype.js');

//Const parameters
const cMaxValidZeros = 256;
const cBitsPerByte = 8;
const cBtitsInHex = 4;

//Local variables
var _Method = DICECalculator.prototype;

//#############################################################################
// Constructor
//#############################################################################

/**
 * General Use constructor of DICE Calcululator.
 *
 * @public
 * @param {String} shaType - "c" or "js"
 * if it's not defined JS will be used by default
 * @return None
 */
function DICECalculator(shaType) {
    // always initialize all instance properties
    if (shaType === 'c') {
        this.sha3 = modSHA3_C;
    } else {
        this.sha3 = modSHA3;
    }
    this.sha3Counter = 0;
}

//#############################################################################
// Public Methods
//#############################################################################

/**
 * Print a simple message to console.
 * Demonstrate the instance is alive.
 * @public
 * @param None
 * @return None
 */
_Method.Alive = function () {
    console.log("Hello Node.js - DICE Unit Calculator");
    console.log(modSHA3_512("Hello Node.js - DICE Unit Calculator"));
};

/**
 * Invoke calculation of new DICE Unit.
 * Contains a busy loop.
 * @public
 * @param {String} addrOp - Digital Address of Operator
 * @param {String} addrMin - Digital Address of Miner
 * @param {Integer} validZeroes - Minimum required zeroes in hash of prototype
 * @return {DICEUnit} unit - valid DICE unit
 */
_Method.getValidDICE = function (addrOp, addrMin, validZeroes) {
    return _CalculateDICEUnit(addrOp, addrMin, validZeroes, this.sha3, this.sha3Counter);
};

/**
 * Calculate SHA3 of Unit.
 *
 * @public
 * @param {DICEUnit} Dice - Calculated DICE unit.
 * @return {Buffer} SHA3 of DICE Unit 
 */
_Method.getSHA3OfUnit = function (DICEUnit) {
    return _GetSHA3OfValidUnit(DICEUnit, this.sha3, this.sha3Counter);
};

/**
 * Calculate SHA3 of Prototype.
 *
 * @public
 * @param {DICEPrototype} Dice - Calculated DICE Prototype.
 * @return {Buffer} SHA3 of DICE Prototype. 
 */
_Method.getSHA3OfProtoType = function (DICEProto) {
    return _GetSHA3OfValidPrototype(DICEProto, this.sha3, this.sha3Counter);
};

/**
 * Calculate SHA3 of Prototype.
 *
 * @public
 * @param {Number} countOfZeroes - count of valid zeroes looking for.
 * @return {Array} Valid chars which must to be checked during validation of zeroes. 
 */
_Method.getHexLookingTable = function (countOfZeroes) {
    return _getTableForRightAlign(countOfZeroes);
};

/**
 * Calculate SHA3-512.
 *
 * @public 
 * @param {String} buffer, {Buffer} buffer
 * @param {Module} sha3 - isntance of module which will be used to calculate SHA3 of input data.
 * @return {String} data in hex.
 */
_Method.CalculateSHA3_512 = function (buffer) {
    return _CalculateSHA3_512(buffer, this.sha3, this.sha3Counter);
};

/**
 * Get SHA3 counter
 *
 * @public 
 * @param None
 * @return {Integer} count of how many times SHA3 was invoked
 */
_Method.getSHA3Count = function () {
    var buf = this.sha3Counter;
    this.sha3Counter = 0;
    return buf;
};

//#############################################################################
// Private Methods
//#############################################################################

//Private
function _CalculatePayload(DICEUnit) {
    var bufArray = (modCrypto.randomBytes(DICEUnit.payLoad.length));
    DICEUnit.setPayload(bufArray);
}

/**
 * Calculate SHA3-512.
 *
 * @private 
 * @param {String} buffer, {Buffer} buffer
 * @param {Module} sha3 - instance of module which will be used to calculate SHA3 of input data.
 * @param {Integer} counter - increment the counter when function called.
 * @return {String} data in hex.
 */
function _CalculateSHA3_512(buffer, sha3, counter) {
    counter++;
    return sha3.sha3_512(buffer);
}

function _PrepareHeader(addrOp, addrMin, validZeros, DICEUnit) {
    DICEUnit.setOperatorAdress(addrOp, 'bs58');
    DICEUnit.setMinerAddress(addrMin, 'bs58');
    DICEUnit.setValidZeros(validZeros);
}

function _CheckValidZeroes(SHA_DICEPrototype, countOfValiZeros) {
    var isInvalid = true;
    var chunks = Math.floor(countOfValiZeros / cBtitsInHex);
    var peiesOfChunks = countOfValiZeros % cBtitsInHex;
    var validHexValue = _getTableForRightAlign(peiesOfChunks);

    var hexChar = SHA_DICEPrototype.charAt(SHA_DICEPrototype.length - chunks - 1);
    isInvalid = !(validHexValue.includes(hexChar));

    //If the last item is valid, 
    //check the previous are they 
    //all equal to zero
    if (false === isInvalid) {
        for (var i = SHA_DICEPrototype.length - 1; i >= SHA_DICEPrototype.length - chunks; i--) {
            hexChar = SHA_DICEPrototype.charAt(i);
            if ("0" !== hexChar) {
                isInvalid = true;
                break;
            }
        }
    } else {
        //Nothing To Do 
    }

    return isInvalid;
}

function _CalculateDICEUnit(addrOp, addrMin, validZeros, sha3, counter) {
    var isInValidDICE = true;
    var DICEUnit = new modDICEUnit();
    var DICEPrototypeL = new modDICEPrototype();
    var SwatchTimerL = new modSwatchTimer();
    var SHA_DICEPrototype = "";
    var SHA_PayLoad = "";

    //Prepare Header
    _PrepareHeader(addrOp, addrMin, validZeros, DICEUnit);

    //Init DICEProto with Header
    DICEPrototypeL.fromDICEUnit(DICEUnit);

    while (isInValidDICE) {
        //Get the changeable data - Time and Payload
        DICEUnit.setSwatchTime(SwatchTimerL.getBeats());
        _CalculatePayload(DICEUnit);

        //Create Prototype from Unit and hashing of Payload
        DICEPrototypeL.setSwatchTime(DICEUnit.swatchTime);
        SHA_PayLoad = _CalculateSHA3_512(DICEUnit.payLoad, sha3, counter );
        DICEPrototypeL.setSHA3PayLoad(SHA_PayLoad);

        //Create SHA3-512 to whole Prototype
        SHA_DICEPrototype = _CalculateSHA3_512(DICEPrototypeL.toUint8Array(), sha3, counter);

        //Validate
        isInValidDICE = _CheckValidZeroes(SHA_DICEPrototype, DICEPrototypeL.validZeros[0]);
    }

    return DICEUnit;
}

function _GetSHA3OfValidUnit(DICEUnit, sha3, counter) {
    var DICEPrototypeL = new modDICEPrototype();
    var SHA_PayLoad = "";

    //Prepare Prototype
    DICEPrototypeL.fromDICEUnit(DICEUnit);

    //First SHA of Payload and save it
    SHA_PayLoad = _CalculateSHA3_512(DICEUnit.payLoad, sha3, counter);
    DICEPrototypeL.setSHA3PayLoad(SHA_PayLoad);

    return _GetSHA3OfValidPrototype(DICEPrototypeL, sha3, counter);
}

function _GetSHA3OfValidPrototype(DICEProto, sha3, counter) {

    //Create SHA of whole DICE Unit
    SHA_DICEPrototype = _CalculateSHA3_512(DICEProto.toUint8Array(), sha3, counter);

    return SHA_DICEPrototype;
}

function _getTableForRightAlign(countOfZeroes) {
    var rightTable;
    switch (countOfZeroes) {
        case 1:
            rightTable = ['e', 'c', 'a', '8', '6', '4', '2', '0'];
            break;
        case 2:
            rightTable = ['c', '4', '0'];
            break;
        case 3:
            rightTable = ['8', '0'];
            break;
        case 0:
        case 4:
            rightTable = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f'];
            break;
        default:
            throw "Invalid Count of zeroes! must be from 1 to 4";
    }

    return rightTable;
}

// export the class
module.exports = DICECalculator;