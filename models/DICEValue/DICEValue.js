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
const modDICEPrototype = require('../DICECalculator/DICEPrototype.js');
/* javascript-obfuscator:enable */

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