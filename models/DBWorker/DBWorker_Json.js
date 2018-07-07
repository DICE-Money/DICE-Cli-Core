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
const modFs = require('fs');
const modMySql = require('sync-mysql');
/* javascript-obfuscator:enable */

//Class access 
var _Method = DBWorker_Json.prototype;

//Local const
//Construtor
function DBWorker_Json() {
    this.filePath = undefined;
    this.fileDB = {};
}

//Private Methods
function _checkForNull(data) {
    if (data === null) {
        throw "Cannot be Null!";
    }
    return data;
}

//Public Methods
_Method.getDICEProto = function (hashOfProto) {
    return this.fileDB[_checkForNull(hashOfProto)];
};

_Method.getNewOwner = function (hashOfProto) {
    var returnData = undefined;
    try {
        returnData = this.fileDB[_checkForNull(hashOfProto)]["newOwner"];
    } catch (e) {
        //Nothing
    }
    return returnData;
};

_Method.getCurrentOwner = function (hashOfProto) {
    var returnData = undefined;
    try {
        returnData = this.fileDB[_checkForNull(hashOfProto)]["curOwner"];
    } catch (e) {
        //Nothing
    }
    return returnData;
};

_Method.addDICEProto = function (hashOfProto, addr, diceProto) {
    var unitData = {};
    unitData["proto"] = _checkForNull(diceProto);
    unitData["curOwner"] = _checkForNull(addr);
    unitData["newOwner"] = "";

    //Add unit if its not exist
    if (!this.fileDB.hasOwnProperty(_checkForNull(hashOfProto))) {
        this.fileDB[_checkForNull(hashOfProto)] = unitData;
    }

    modFs.writeFileSync(this.filePath, JSON.stringify(this.fileDB, null, 0), 'utf-8');
};

_Method.writeNewOwner = function (hashOfProto, newOwner) {
    this.fileDB[_checkForNull(hashOfProto)]["newOwner"] = _checkForNull(newOwner);
    modFs.writeFileSync(this.filePath, JSON.stringify(this.fileDB, null, 0), 'utf-8');
};

_Method.writeCurrentOwner = function (hashOfProto, curOwner) {
    this.fileDB[_checkForNull(hashOfProto)]["curOwner"] = _checkForNull(curOwner);
    this.fileDB[_checkForNull(hashOfProto)]["newOwner"] = "";
    modFs.writeFileSync(this.filePath, JSON.stringify(this.fileDB, null, 0), 'utf-8');
};

_Method.isNewOwnerEmpty = function (hashOfProto) {
    var returnData = undefined;
    try {
        return  (this.fileDB[_checkForNull(hashOfProto)]["newOwner"] === "");
    } catch (e) {
        //Nothing
    }
    return returnData;
};

_Method.remove = function (hashOfProto) {
    delete this.fileDB[_checkForNull(hashOfProto)];
    modFs.writeFileSync(this.filePath, JSON.stringify(this.fileDB, null, 0), 'utf-8');
};

_Method.initializeDB = function (pathToStorage, typeOfStorage) {
    if ('json' === typeOfStorage) {
        try {
            this.fileDB = modFs.readFileSync(pathToStorage, "utf8");
            if ("" !== this.fileDB) {
                this.fileDB = JSON.parse(this.fileDB);
            } else {
                throw "Invalid DNSBinder DB";
            }
        } catch (err) {
            modFs.writeFileSync(pathToStorage, JSON.stringify(this.fileDB, null, 0), 'utf-8');
        }
        this.filePath = pathToStorage;
    }
};

_Method.clean = function () {
    this.fileDB = {};
    modFs.writeFileSync(this.filePath, JSON.stringify(this.fileDB, null, 0), 'utf-8');
    modFs.unlink(this.filePath, () => {
    });
};

_Method.remove = function (hashOfProto) {
    delete this.fileDB[_checkForNull(hashOfProto)];
    modFs.writeFileSync(this.filePath, JSON.stringify(this.fileDB, null, 0), 'utf-8');
};

module.exports = DBWorker_Json;