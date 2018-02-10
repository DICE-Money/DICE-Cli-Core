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
const modDICEPrototype = require('../DICECalculator/DICEPrototype.js');

//Class access 
var _Method = DICEValue.prototype;

//Local const
const cBtitsInHex = 4;
const cNmargin = 10;
const cMaxValueOfDICE = 1024;
const cMinValueOfDICE = 1 / 1024;
const cInvalidDICE = "InvalidDICE";

function DICEValue(DICECalculator) {
    this.unitValue = 1;
    this.unitMax = 1;
    this.DICEProto = undefined;
    this.DICECalculator = DICECalculator;
}

_Method.calculateValue = function (k, N) {
    var Nmax = N + cNmargin;
    var b = _getTralingZeroesInDICEProto(this.DICEProto, this.DICECalculator);
    var z = this.DICEProto.validZeros[0];

    var value = (k * (
            (Math.pow(2, (b - z))) /
            (Math.pow(2, (N - z)))
            ));

    //Check boundry
    if (cMaxValueOfDICE < value) {
        value = cMaxValueOfDICE;
    } else if (cMinValueOfDICE > value) {
        value = cInvalidDICE;
    }

    //Save values
    this.unitValue = value;
    this.unitMax = Math.pow(2, Nmax);
};

_Method.getDICEProto = function () {
    return this.DICEProto;
};

_Method.setDICEProtoFromUnit = function (DICEUnit) {
    if (null !== DICEUnit) {
        var DICEPrototypeL = new modDICEPrototype();

        //Prepare Prototype
        DICEPrototypeL.fromDICEUnit(DICEUnit);
        SHA_PayLoad = this.DICECalculator.CalculateSHA3_512(DICEUnit.payLoad);
        DICEPrototypeL.setSHA3PayLoad(SHA_PayLoad);

        this.DICEProto = DICEPrototypeL;
    } else {
        throw "Error it cannot be Undefined!";
    }
};

_Method.setDICEProto = function (DICEProto) {
    if (null !== DICEProto) {
        this.DICEProto = DICEProto;
    } else {
        throw "Error it cannot be Undefined!";
    }
};

_Method.getZeroes = function () {
    return _getTralingZeroesInDICEProto(this.DICEProto);
};

_Method.getZeroesFromN = function (diceValue, N) {
    var zeroes = 1;
    var N = parseInt(N);
    var diceValueL = diceValue;

    if (diceValue.indexOf("/") !== -1) {
        var diceValueArray = [];
        diceValueArray = diceValue.split('/');
        diceValueL = diceValueArray[0] / diceValueArray[1];
    }

    //Calculate zeroes
    zeroes = N - (Math.log(1 / diceValueL) / Math.log(2));
    
    return zeroes;
};

//Private
function _getTralingZeroesInDICEProto(DICEProto, DICECalc) {
    var sha3OfDICE = DICECalc._GetSHA3OfValidPrototype(DICEProto);
    var cArrayValidHex = [
        DICECalc.getHexLookingTable(1),
        DICECalc.getHexLookingTable(2),
        DICECalc.getHexLookingTable(3)
    ];

    return _getTralingZeroes(sha3OfDICE, cArrayValidHex);
}

function _getTralingZeroes(sha3OfDICE, arrayOfValid) {
    var b = 1; //at least one zero
    var countOfZeros = 0;
    var lastPosition = sha3OfDICE.length - 1;

    //Walkthouhgt the whole hex string
    for (var i = sha3OfDICE.length - 1; i >= 0; i--) {
        if ("0" === sha3OfDICE.charAt(i)) {
            countOfZeros++;
        } else {
            break;
        }
    }

    //Update last postion
    lastPosition -= countOfZeros;
    //One "0" has 4 real zeroes
    countOfZeros *= cBtitsInHex;
    //Get char at last position
    sha3OfDICE = sha3OfDICE.charAt(lastPosition);
    //Validate char at last position
    for (var i = (arrayOfValid.length - 1); i >= 0; i--) {
        if (false !== arrayOfValid[i].includes(sha3OfDICE)) {
            countOfZeros += (i + 1);
            break;
        }
    }

    b = countOfZeros;
    return b;
}

function _getTralingZeroesInDICEProto(DICEProto, DICECalc) {
    var sha3OfDICEProto = DICECalc.getSHA3OfProtoType(DICEProto);
    var cArrayValidHex = [
        DICECalc.getHexLookingTable(1),
        DICECalc.getHexLookingTable(2),
        DICECalc.getHexLookingTable(3)
    ];
    return _getTralingZeroes(sha3OfDICEProto, cArrayValidHex);
}

module.exports = DICEValue;