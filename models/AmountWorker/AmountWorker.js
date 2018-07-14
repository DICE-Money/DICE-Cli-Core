/* 
 * Copyright 2018 Mihail Maldzhanski<pollarize@gmail.com>.
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

/* javascript-obfuscator:disable */

//Required
const modDA_Worker = require('../AddressCalculator/DigitalAdressCalculator_ECDH.js');
const modBS58 = require('../Base58/Base58.js');
const modFs = require('fs');

/* javascript-obfuscator:enable */

//Class access 
var _Method = AmountWorker.prototype;
var Bs58 = new modBS58();

//Local const
const cDigitalAddressLength = new modDA_Worker().GetDALength();

function AmountWorker() {
    //Nothing
}

/* objUnitsDataList = {name, operator, owner, value}*/
_Method.encodeAmount = function (arObjUnitsDataList, flTargetAmount) {
    var intCurIndex = 0;
    var flCurAmount = 0.0;
    var intLasAddedIndex = undefined;
    var arUnits = [];
    var flTargetAmountL = flTargetAmount / 1024;
    var arUnitsLastReached = [];
    var flAmountLastReached = 0.0;
    var intStaringIndex = 1;

    // 0. Remove units without owner
    var arObjUnitsDataList_Owner = [];
    for (var unit of arObjUnitsDataList) {
        if (unit.owner !== undefined && unit.owner.length === cDigitalAddressLength) {
            arObjUnitsDataList_Owner.push(unit);
        }
    }

    // 1. Sort array of units - Bigger -> Smaller
    var arObjUnitsDataList_Sorted = arObjUnitsDataList_Owner.sort(function (first, second) {
        return second.value - first.value;
    });

    // 2,3,4 Execute 
    for (var unit of arObjUnitsDataList_Sorted) {

        if (flCurAmount > flTargetAmountL) {
            //Save last achievied sum
            arUnitsLastReached = JSON.parse(JSON.stringify(arUnits));
            flAmountLastReached = flCurAmount;
            if (arObjUnitsDataList_Sorted[intLasAddedIndex].value > unit.value
                    //Check for diviation 
                    && ((flCurAmount
                            - arObjUnitsDataList_Sorted[intLasAddedIndex].value)
                            + unit.value) < flCurAmount) {
                arUnits.pop();
                flCurAmount -= arObjUnitsDataList_Sorted[intLasAddedIndex].value;
            }
        }

        //Add only members which are smaller
        if (flCurAmount < flTargetAmountL && unit.value <= flTargetAmountL) {
            if (flCurAmount === 0.0 && intCurIndex > 0) {
                intStaringIndex = intCurIndex;
            }
            intLasAddedIndex = intCurIndex;
            arUnits.push(unit.name);
            flCurAmount += unit.value;
        }

        //Terminate on exact sum
        if (flCurAmount === flTargetAmountL) {
            break;
        }

        intCurIndex++;
    }

    if (flCurAmount < flTargetAmountL) {
        //Situation when counting to end doesnt work
        if (arUnitsLastReached.length > 1) {
            flCurAmount = flAmountLastReached;
            arUnits = arUnitsLastReached;
        } else {
            //Situation when starting unit is a whole unit and its not possible to sum other
            arUnits = [];
            flCurAmount = 0.0;
            var objUnitL = {};

            if (arObjUnitsDataList_Sorted.length > 0) {
                do {
                    objUnitL = arObjUnitsDataList_Sorted.pop();
                    console.log(JSON.stringify(objUnitL));
                } while (arObjUnitsDataList_Sorted.length > 0 && objUnitL.value <= flTargetAmountL);

                if (objUnitL.value >= flTargetAmountL) {
                    arUnits.push(objUnitL.name);
                    flCurAmount = objUnitL.value;
                }else{
                    // No unit found
                }
            }
        }
    }
    return {units: arUnits, amount: flCurAmount};
};

_Method.packUnits = function (objAmountReaturnData, encryptor, AddressGen, strCurAddr, strTargetAddr) {
    var arrUnitsContent = [];

    //Read allunits and store to array
    for (var unitPath of objAmountReaturnData.units) {
        arrUnitsContent.push(modFs.readFileSync(unitPath, "utf-8"));
    }

    //Decide to encrypt
    if (strTargetAddr !== undefined) {
        //Encrypt unit which is in BS58 with new owner address
        var encData = encryptor.encryptFilePublicKey
                (
                        JSON.stringify(arrUnitsContent),
                        Buffer.from(Bs58.decode(AddressGen.convertHexDashToBS58(strTargetAddr)))
                        );

        //Pr  eapare data for storing
        var fsData = {};
        fsData['addr'] = strCurAddr;
        fsData['units'] = encData;

    } else {
        var fsData = arrUnitsContent;
    }

    return Bs58.encode(JSON.stringify(fsData)).toString();
};

_Method.unPackUnits = function () {

};

module.exports = AmountWorker;
