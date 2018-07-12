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
const modBS58 = require('bs58');
/* javascript-obfuscator:enable */


//Class access 
var _Method = AmountWorker.prototype;
//Local const

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
    var intStaringIndex = 1;

    // 1. Sort array of units - Bigger -> Smaller
    var arObjUnitsDataList_Sorted = arObjUnitsDataList.sort(function (first, second) {
        return second.value - first.value;
    });

    // 2,3,4 Execute 
    for (var unit of arObjUnitsDataList) {
        if (flCurAmount > flTargetAmountL) {
            //Save last achievied sum
            arUnitsLastReached = JSON.parse(JSON.stringify(arUnits));
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
            arUnits = arUnitsLastReached;
        } else {
            //Situation when starting unit is a whole unit and its not possible to sum other
            arUnits = [];
            arUnits.push(arObjUnitsDataList_Sorted[intStaringIndex - 1].name);
        }
    }

    return arUnits;
};
_Method.decodeAmount = function (objUnitsDataList) {

};
module.exports = AmountWorker;
