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
const modFs = require('fs');
const modHttp = require('https');

//Class access 
var _Method = DNSBinder.prototype;

//Local const
const cDnsHttp = "./dns.json";

//Construtor
function DNSBinder() {
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

_Method.getGoogleDriveNewUrl = function (data) {
    data = modFs.readFileSync(data).toString();
    var httpsPosStart = data.indexOf("https");
    var httpsPosEnd = data.indexOf("download", httpsPosStart);
    var url = data.substr(httpsPosStart, (httpsPosEnd+"download".length) - httpsPosStart);
    return url;

};

_Method.getGoogleDriveData = function (link, cb) {
    var module = this;
    var file = modFs.createWriteStream(cDnsHttp);
    modHttp.get(link, function (response) {
        response.pipe(file);
        file.on('finish', function () {
            //Close file
            file.close();

            //Read new link
            var newUrl = module.getGoogleDriveNewUrl(cDnsHttp);

            //Delete file
            modFs.unlink(cDnsHttp, () => {
                file = modFs.createWriteStream(cDnsHttp);
                modHttp.get(newUrl, function (response) {
                    response.pipe(file);
                    file.on('finish', function () {
                        file.close();
                        module.initializeDB(cDnsHttp, "json");
                        cb();
                    });
                });
            });
        });
    });

};


module.exports = DNSBinder;