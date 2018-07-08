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
    var intLasAddedIndex = 0;
    var arUnits = [];
    var flTargetAmountL = flTargetAmount / 1024;

    // 1. Sort array of units - Bigger -> Smaller
    var arObjUnitsDataList_Sorted = arObjUnitsDataList.sort(function (first, second) {
        return first.value < second.value;
    });

    // 2,3 Execute 
    do {
        //Check if the sum overlaps and exchange last with the smallest one
        if (flCurAmount > flTargetAmountL && 
                arObjUnitsDataList_Sorted[intLasAddedIndex].value > arObjUnitsDataList_Sorted[intCurIndex].value) {
            arUnits.pop();
            flCurAmount -= arObjUnitsDataList_Sorted[intLasAddedIndex].value;
        } else {
            //Add only proper members
            if (arObjUnitsDataList_Sorted[intCurIndex].value < flTargetAmountL) {
                intLasAddedIndex = intCurIndex;
                arUnits.push(arObjUnitsDataList_Sorted[intCurIndex].name);
                flCurAmount += arObjUnitsDataList_Sorted[intCurIndex].value;
            }
        }
        intCurIndex++;
    } while (intCurIndex < arObjUnitsDataList_Sorted.length);

    console.log(flCurAmount * 1024, flTargetAmountL);

    return arUnits;
};

_Method.decodeAmount = function (objUnitsDataList) {

};


module.exports = AmountWorker;
