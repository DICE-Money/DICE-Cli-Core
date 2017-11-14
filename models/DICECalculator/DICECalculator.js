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
const modSHA3_512 = require('js-sha3').sha3_512;
const modSwatchTimer = require('../SwatchBeats/SwatchTimer.js');
const modDICEUnit = require('./DICEUnit.js');
const modDICEPrototype = require('./DICEPrototype.js');
const modDICEHeader = require('./DICEHeader.js');

//Const parameters
const cMaxValidZeros = 256;
const cBitsPerByte = 8;
const cBtitsInHex = 4;

//Local variables
var _Method = DICECalculator.prototype;

// Constructor
function DICECalculator() {
    // always initialize all instance properties
}

//Private
function _CalculatePayload(DICEUnit) {
    var bufArray = (modCrypto.randomBytes(DICEUnit.payLoad.length));
    DICEUnit.setPayload(bufArray);
}

/**
 * Creates a String from data.
 *
 * @private
 * @param {String,Uint8Array} buffer
 * @return {String} in hex.
 */
function _CalculateSHA3_512(buffer) {
    return modSHA3_512(buffer);

}
;

function _ValidatePrototype(prototype) {
    var isValidPrototype = false;
    return isValidPrototype;
}

function _SendValidPrototype(prototype) {
    return true;
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
    //check the previos are they 
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

function _CalculateDICEUnit(addrOp, addrMin, validZeros) {
    var isInValidDICE = true;
    var DICEUnit = new modDICEUnit();
    var DICEPrototypeL = new modDICEPrototype();
    var SwatchTimerL = new modSwatchTimer();
    var SHA_DICEPrototype = "";
    var SHA_PayLoad = "";

    //Real Calculation Algorithm
    _PrepareHeader(addrOp, addrMin, validZeros, DICEUnit);

    while (isInValidDICE) {

        //Get the changeable data - Time and Payload
        DICEUnit.setSwatchTime(SwatchTimerL.getBeats());
        _CalculatePayload(DICEUnit);

        //Create Prototype from Unit and hashing of Payload
        DICEPrototypeL.fromDICEUnit(DICEUnit);
        SHA_PayLoad = _CalculateSHA3_512(DICEUnit.payLoad);
        DICEPrototypeL.setSHA3PayLoad(SHA_PayLoad);

        //Create SHA3-512 to whole Prototype
        SHA_DICEPrototype = _CalculateSHA3_512(DICEPrototypeL.toUint8Array());

        //Validate
        isInValidDICE = _CheckValidZeroes(SHA_DICEPrototype, DICEPrototypeL.validZeros[0]);
        if (true !== isInValidDICE) {
            _SendValidPrototype(DICEPrototypeL);
        }
    }

    return DICEUnit;
}

function _GetSHA3OfValidUnit(DICEUnit) {
    var DICEPrototypeL = new modDICEPrototype();
    var SHA_PayLoad = "";

    //Prepare Prototype
    DICEPrototypeL.fromDICEUnit(DICEUnit);

    //First SHA of Payload and save it
    SHA_PayLoad = _CalculateSHA3_512(DICEUnit.payLoad);
    DICEPrototypeL.setSHA3PayLoad(SHA_PayLoad);

    return _GetSHA3OfValidPrototype(DICEPrototypeL);
}

function _GetSHA3OfValidPrototype(DICEProto) {

    //Create SHA of whole DICE Unit
    SHA_DICEPrototype = _CalculateSHA3_512(DICEProto.toUint8Array());

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
            rightTable = ['0','1','2','3','4','5','6','7','8','9','a','b','c','d','e','f'];
            break;
        default:
            throw "Invalid Count of zeroes! must be from 1 to 4";
            break;
    }

    return rightTable;
}

//Public
_Method.Alive = function () {
    console.log("Hello Node.js - DICE Unit Calculator");
    console.log(modSHA3_512("Hello Node.js - DICE Unit Calculator"));
};

_Method.getValidDICE = function (addrOp, addrMin, validZeros) {
    return _CalculateDICEUnit(addrOp, addrMin, validZeros);
};

_Method.getSHA3OfUnit = function (DICEUnit) {
    return _GetSHA3OfValidUnit(DICEUnit);
};

_Method.getSHA3OfProtoType = function (DICEProto) {
    return _GetSHA3OfValidPrototype(DICEProto);
};

_Method.getHexLookingTable = function (countOfZeroes) {
    return _getTableForRightAlign(countOfZeroes);
};

_Method.CalculateSHA3_512 = function (buffer) {
    return _CalculateSHA3_512(buffer);
};

// export the class
module.exports = DICECalculator;