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
const modCloud = require('../CloudRequester/CloudRequester');

/* javascript-obfuscator:enable */

//Class access 
var _Method = DNSBinder.prototype;

//Local const
const cDnsHttp = "./dns.json";
const maxReq = 10;

//Construtor
function DNSBinder() {
    this.filePath = undefined;
    this.fileDB = {};
    this.cloud = new modCloud(maxReq);
}

//Private Methods
function _checkForNull(data) {
    if (data === null) {
        throw "Cannot be Null!";
    }
    return data;
}

//Public Methods
_Method.lookup = function (addrOp) {
    return this.fileDB[_checkForNull(addrOp)];
};

_Method.remove = function (addrOp) {
    delete this.fileDB[_checkForNull(addrOp)];
    modFs.writeFileSync(this.filePath, JSON.stringify(this.fileDB, null, 0), 'utf-8');
};

_Method.addServer = function (addr, addrIp, addrPort) {
    this.fileDB[_checkForNull(addr)] = ({ip: _checkForNull(addrIp), port: _checkForNull(addrPort)});
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
};

_Method.readFromHttpServer = function (link, cb) {
    var module = this;
    var file = modFs.createWriteStream(cDnsHttp);
    modHttp.get(link, function (response) {
        response.pipe(file);
        file.on('finish', function () {
            file.close();
            module.initializeDB(cDnsHttp, "json");
            cb();
        });
    });
};

_Method.getGoogleDriveData = function (link, cb) {
    this.cloud.getGoogleDriveData(link, (object) => {
        modFs.writeFileSync(cDnsHttp,JSON.stringify(object));
        cb();
    });
};


module.exports = DNSBinder;