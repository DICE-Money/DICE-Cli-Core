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

};


module.exports = CloudRequester;