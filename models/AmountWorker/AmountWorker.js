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

_Method.encode = function (data) {
    return modBS58.encode(data);
};

_Method.decode = function (data) {
    return modBS58.decode(data);
};


module.exports = AmountWorker;
