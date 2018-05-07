/* javascript-obfuscator:disable */
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
//Temporary disabled
const modSHA3_C = require('../../models/SHA-3_C/build/Release/sha3_C_Addon');
const modSHA3 = require('js-sha3');
const modSwatchTimer = require('../SwatchBeats/SwatchTimer.js');
const modDICEUnit = require('./DICEUnit.js');
const modDICEPrototype = require('./DICEPrototype.js');
const modChild_process = require('child_process');
const modFs = require('fs');
/* javascript-obfuscator:enable */

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
 * @author Mihail Maldzhanski <pollarize@gmail.com>
 * @example
 * const modDICECalculator = require('<path>/DICECalculator.js'); 
 * var DICECalc = new DICECalculator("js");
 * var DICEUnit = DICECalc.getValidDICE_CUDA(addrOp, addrMin, zeroes, pathToCuda, "cudaJsUnit.json");
 * @constructor
 * @param {String} shaType - "c" or "js"
 * if it's not defined JS will be used by default
 * @return {DICECalculator} instance
 */
function DICECalculator(shaType) {
    // always initialize all instance properties
    if (shaType === 'c') {
        this.sha3 = modSHA3;
    } else {
        this.sha3 = modSHA3;
    }
    this.sha3Counter = 0;
    this.type = shaType;
}

//#############################################################################
// Public Methods
//#############################################################################

/**
 * Print a simple message to console.
 * Demonstrate the instance is alive.
 * @memberOf DICECalculator
 * @function
 * @name Alive
 * @return None
 */
_Method.Alive = function () {
    console.log("Hello Node.js - DICE Unit Calculator");
    console.log(modSHA3_512("Hello Node.js - DICE Unit Calculator"));
};

/**
 * Invoke calculation of new DICE Unit.
 * Contains a busy loop.
 * @memberOf DICECalculator
 * @function
 * @name getValidDICE
 * @param {String} addrOp - Digital Address of Operator
 * @param {String} addrMin - Digital Address of Miner
 * @param {Integer} validZeroes - Minimum required zeroes in hash of prototype
 * @return {DICEUnit} unit - valid DICE unit
 */
_Method.getValidDICE = function (addrOp, addrMin, validZeroes) {
    return _CalculateDICEUnit(addrOp, addrMin, validZeroes, this.sha3, this.sha3Counter, this.type);
};

/**
 * Invoke calculation of new DICE Unit.
 * Contains a busy loop.
 * @function
 * @memberOf DICECalculator
 * @name getValidDICE_CUDA
 * @param {String} addrOp - Digital Address of Operator
 * @param {String} addrMin - Digital Address of Miner
 * @param {Integer} validZeros - Minimum required zeroes in hash of prototype
 * @param {String} cudaAppPath - Path to Cuda application
 * @param {String} outputFile - File to store calculated Unit
 * @return {DICEUnit} unit - valid DICE unit
 */
_Method.getValidDICE_CUDA = function (addrOp, addrMin, validZeros, globalTh, cudaAppPath, outputFile, diceScrapCallback, finishCallback) {
    return  _CalculateDICEUnitCUDA_Scrapping(addrOp, addrMin, validZeros, globalTh, cudaAppPath, outputFile, diceScrapCallback, finishCallback);
};

/**
 * Calculate SHA3 of Unit.
 * @function
 * @memberOf DICECalculator
 * @name getSHA3OfUnit
 * @param {DICEUnit} DICEUnit - Calculated DICE unit.
 * @return {Buffer} SHA3 of DICE Unit 
 */
_Method.getSHA3OfUnit = function (DICEUnit) {
    return _GetSHA3OfValidUnit(DICEUnit, this.sha3, this.sha3Counter, this.type);
};

/**
 * Calculate SHA3 of Prototype.
 * @function
 * @memberOf DICECalculator
 * @name getSHA3OfProtoType
 * @param {DICEPrototype} DICEProto - Calculated DICE Prototype.
 * @return {Buffer} SHA3 of DICE Prototype. 
 */
_Method.getSHA3OfProtoType = function (DICEProto) {
    return _GetSHA3OfValidPrototype(DICEProto, this.sha3, this.sha3Counter, this.type);
};

/**
 * Calculate SHA3 of Prototype.
 * @function
 * @memberOf DICECalculator
 * @name getHexLookingTable
 * @param {Number} countOfZeroes - count of valid zeroes looking for.
 * @return {Array} Valid chars which must to be checked during validation of zeroes. 
 */
_Method.getHexLookingTable = function (countOfZeroes) {
    return _getTableForRightAlign(countOfZeroes);
};

/**
 * Calculate SHA3-512.
 * @function
 * @memberOf DICECalculator
 * @name CalculateSHA3_512
 * @param {String} buffer @or {Buffer} buffer
 * @return {String} data in hex.
 */
_Method.CalculateSHA3_512 = function (buffer) {
    return _CalculateSHA3_512(buffer, this.sha3, this.sha3Counter, this.type);
};

/**
 * Get SHA3 counter
 * @function
 * @memberOf DICECalculator
 * @name getSHA3Count
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
 * @function
 * @private
 * @name _CalculateSHA3_512
 * @param {String} buffer or {Buffer} buffer
 * @param {Module} sha3 - instance of module which will be used to calculate SHA3 of input data.
 * @param {Integer} counter - increment the counter when function called.
 * @param {String} type - "c" or "js"
 * @return {String} data in hex.
 */
function _CalculateSHA3_512(buffer, sha3, counter, type) {
    counter++;
    var bufferL = undefined;
    if (type === 'c') {
        bufferL = Buffer.from(buffer).toString('hex');
    } else {
        bufferL = buffer;
    }
    return sha3.sha3_512(bufferL);
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

function _CalculateDICEUnit(addrOp, addrMin, validZeros, sha3, counter, type) {
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
        SHA_PayLoad = _CalculateSHA3_512(DICEUnit.payLoad, sha3, counter, type);
        DICEPrototypeL.setSHA3PayLoad(SHA_PayLoad);

        //Create SHA3-512 to whole Prototype
        SHA_DICEPrototype = _CalculateSHA3_512(DICEPrototypeL.toUint8Array(), sha3, counter, type);

        //Validate
        isInValidDICE = _CheckValidZeroes(SHA_DICEPrototype, DICEPrototypeL.validZeros[0]);
    }

    return DICEUnit;
}

function _CalculateDICEUnitCUDA(addrOp, addrMin, validZeros, cudaAppPath, outputFile) {
    var DICEUnit = new modDICEUnit();
    var DICEUnitJson = new modDICEUnit();
    modChild_process.execFileSync(cudaAppPath, [outputFile, addrOp, addrMin, _byteToHex(validZeros.toString())], {stdio: ['pipe', process.stdout, process.stderr]});
    var file = modFs.readFileSync(outputFile, "utf8");
    try {
        DICEUnitJson = DICEUnit.from(file);

        //Assing data to real bject
        DICEUnit.addrOperator = DICEUnitJson.addrOperator;
        DICEUnit.addrMiner = DICEUnitJson.addrMiner;
        DICEUnit.validZeros = DICEUnitJson.validZeros;
        DICEUnit.swatchTime = DICEUnitJson.swatchTime;
        DICEUnit.payLoad = DICEUnitJson.payLoad;

        modFs.unlink(outputFile, function (error) {
            if (error) {
                throw error;
            }
        });
    } catch (e)
    {
        //Nothing
    }
    return DICEUnit;
}

function _CalculateDICEUnitCUDA_Scrapping(addrOp, addrMin, validZeros, globalTh, cudaAppPath, outputFile, diceScrapCallback, finishCallback) {
    var DICEUnit = new modDICEUnit();
    var DICEUnitJson = new modDICEUnit();
    var DICEUnitScrap = new modDICEUnit();
    globalTh = 34;
    modChild_process.execFile(cudaAppPath,
            [
                outputFile,
                addrOp,
                addrMin,
                _byteToHex(validZeros.toString()),
                _byteToHex(globalTh.toString())
            ],
            {stdio: ['pipe', process.stdout, process.stderr]});

    var scrapBankFiles = {};

    //Wait to generate new unit and check periodically for "scrapped" units
//    while (true)
//    {
//        modFs.readdirSync("./").forEach(file => {
//            if (file.indexOf("dicescr") !== -1 && !scrapBankFiles.hasOwnProperty(file)) {
//                scrapBankFiles[file] = modFs.readFileSync(file, "utf8");
//                DICEUnitJson = DICEUnitScrap.from(scrapBankFiles[file]);
//                
//                //Assing data to real bject
//                DICEUnitScrap.addrOperator = DICEUnitJson.addrOperator;
//                DICEUnitScrap.addrMiner = DICEUnitJson.addrMiner;
//                DICEUnitScrap.validZeros = DICEUnitJson.validZeros;
//                DICEUnitScrap.swatchTime = DICEUnitJson.swatchTime;
//                DICEUnitScrap.payLoad = DICEUnitJson.payLoad;
//
//                diceScrapCallback(DICEUnitScrap);
//            }
//        });
//
//        try {
//    var file = modFs.readFileSync(outputFile, "utf8");
//            break;
//        } catch (e) {
//
//        }
//    }
//    
    // Example when handled through fs.watch() listener
    var fsWatch = modFs.watch('./', {encoding: 'utf8'}, () => {
        modFs.readdirSync("./").forEach(file => {
            if (file.indexOf("dicescr") !== -1 && !scrapBankFiles.hasOwnProperty(file)) {
                scrapBankFiles[file] = modFs.readFileSync(file, "utf8");

                //Return Dice Scrap function handlers
                var functionHandlers = {get: getDICEScrap, remove: removeDICEScrap};
                diceScrapCallback(functionHandlers);
            }

            try {
                var file = modFs.readFileSync(outputFile, "utf8");
                DICEUnitJson = DICEUnit.from(file);

                //Assing data to real bject
                DICEUnit.addrOperator = DICEUnitJson.addrOperator;
                DICEUnit.addrMiner = DICEUnitJson.addrMiner;
                DICEUnit.validZeros = DICEUnitJson.validZeros;
                DICEUnit.swatchTime = DICEUnitJson.swatchTime;
                DICEUnit.payLoad = DICEUnitJson.payLoad;

                modFs.unlink(outputFile, function (error) {
                    if (error) {
                        throw error;
                    }
                });

                //Exit
                fsWatch.close();
                finishCallback(DICEUnit);
            } catch (e)
            {
                //Nothing
            }
        });
    });

    function getDICEScrap() {
        if (Object.keys(scrapBankFiles).length > 0) {
            var fileName = Object.keys(scrapBankFiles)[0];

            //Read data from JSON file
            DICEUnitJson = DICEUnitScrap.from(scrapBankFiles[fileName]);

            //Assing data to real bject
            DICEUnitScrap.addrOperator = DICEUnitJson.addrOperator;
            DICEUnitScrap.addrMiner = DICEUnitJson.addrMiner;
            DICEUnitScrap.validZeros = DICEUnitJson.validZeros;
            DICEUnitScrap.swatchTime = DICEUnitJson.swatchTime;
            DICEUnitScrap.payLoad = DICEUnitJson.payLoad;

        }

        return {fileName: fileName, unit: DICEUnitScrap};
    }

    function removeDICEScrap(file) {
        //Delete on FS
        modFs.unlink(file, () => {/*Nothing*/
        });

        //Remove from bank
        delete(scrapBankFiles[file]);
    }
//    try {
//        var file = modFs.readFileSync(outputFile, "utf8");
//        DICEUnitJson = DICEUnit.from(file);
//
//        //Assing data to real bject
//        DICEUnit.addrOperator = DICEUnitJson.addrOperator;
//        DICEUnit.addrMiner = DICEUnitJson.addrMiner;
//        DICEUnit.validZeros = DICEUnitJson.validZeros;
//        DICEUnit.swatchTime = DICEUnitJson.swatchTime;
//        DICEUnit.payLoad = DICEUnitJson.payLoad;
//
//        modFs.unlink(outputFile, function (error) {
//            if (error) {
//                throw error;
//            }
//        });
//    } catch (e)
//    {
//        //Nothing
//    }
//    return DICEUnit;
}

function _GetSHA3OfValidUnit(DICEUnit, sha3, counter, type) {
    var DICEPrototypeL = new modDICEPrototype();
    var SHA_PayLoad = "";

    //Prepare Prototype
    DICEPrototypeL.fromDICEUnit(DICEUnit);

    //First SHA of Payload and save it
    SHA_PayLoad = _CalculateSHA3_512(DICEUnit.payLoad, sha3, counter, type);
    DICEPrototypeL.setSHA3PayLoad(SHA_PayLoad);

    return _GetSHA3OfValidPrototype(DICEPrototypeL, sha3, counter, type);
}

function _GetSHA3OfValidPrototype(DICEProto, sha3, counter, type) {

    //Create SHA of whole DICE Unit
    SHA_DICEPrototype = _CalculateSHA3_512(DICEProto.toUint8Array(), sha3, counter, type);

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

function _byteToHex(b) {
    var hexChar = ["0", "1", "2", "3",
        "4", "5", "6", "7",
        "8", "9", "A", "B",
        "C", "D", "E", "F"];
    var hexValue = hexChar[(b >> 4) & 0x0f] + hexChar[b & 0x0f];

    return hexValue;
}

// export the class
module.exports = DICECalculator;