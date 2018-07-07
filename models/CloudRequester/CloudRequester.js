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
const modHttp = require('https');
/* javascript-obfuscator:enable */

//Class access 
var _Method = CloudRequester.prototype;

//Construtor
function CloudRequester(maxReq) {
    this.maxReqCounter = maxReq;
    this.maxReqCounterSaved = maxReq;
}

//Public 
_Method.getGoogleDriveNewUrl = function (data) {
    var httpsPosStart = data.indexOf("https");
    var httpsPosEnd = data.indexOf("\">here", httpsPosStart);
    var url = data.substr(httpsPosStart, (httpsPosEnd) - httpsPosStart);
    return url;
};

_Method.getGoogleDriveData = function (link, cb) {
    var internalBufferL = "";
    var parsedObject = {};
    var module = this;

    try {
        modHttp.get(link, function (response) {

            response.on('data', function (data) {
                //Read all data
                internalBufferL += data;
            });

            response.on('error', function (data) {
                //Return error
                cb(data);
            });

            response.on('end', function () {
                try {
                    parsedObject = JSON.parse(internalBufferL);
                    module.maxReqCounter = module.maxReqCounterSaved;
                    cb(parsedObject);
                } catch (NotAObject) {
                    //Read new link
                    var newUrl = module.getGoogleDriveNewUrl(internalBufferL);

                    if (module.maxReqCounter > 0) {
                        //Recursive call
                        module.getGoogleDriveData(newUrl, cb);

                        //Decrement
                        module.maxReqCounter--;
                    } else {
                        cb(new Error("Cloud Request reach max execution counter! Check URL!"));
                    }
                }
            });
        }).on('error', function (data) {
            //Return error
            cb(data);
        });
    } catch (ex) {
        //Return error
        cb(ex);
    }

};


module.exports = CloudRequester;