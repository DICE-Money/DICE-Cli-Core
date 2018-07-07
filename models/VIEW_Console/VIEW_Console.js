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
/* javascript-obfuscator:enable */

//Class access 
var _Method = VIEW_Console.prototype;

//Local const
function VIEW_Console(codeTable, portTable, printCode) {
    //Create
    this.codeTable = {};
    this.portTable = {};
    this.allowedTypes = {};

    //Init
    this.portTable = portTable;
    this.codeTable = codeTable(this.portTable);
    this.updateCodeTable = codeTable; //Function
    this.defPortInit = 'pPort is NOT connected';
    this.printCodes = printCode;
}


_Method.printCode = function (type, code, data) {
    if ('code' === this.printCodes) {
        this.printCodeMap(type, code, data);
    } else if ('text' === this.printCodes) {
        this.printCodeText(type, code, data);
    } else if ('rpc' === this.printCodes) {
        this.printCodeMapRpc(type, code, data);
    } else {
        throw "Incorrect configuration";
    }
};

_Method.printCodeText = function (type, code, data) {
    this.setDataPort(code, data);
    var text = this.getTextByCode(type, code);
    console.log(text);
};

_Method.printCodeMap = function (type, code, data) {
    if (true === this.allowedTypes[type]) {
        this.setDataPort(code, data);
        if (this.defPortInit !== this.codeTable[type][code].data) {
            console.log(code, " : ", this.codeTable[type][code].data);
        } else {
            console.log(code);
        }
    }
};

_Method.printCodeMapRpc = function (type, code, data) {
    if (true === this.allowedTypes[type]) {
        this.setDataPort(code, data);
        if (this.defPortInit !== this.codeTable[type][code].data) {
            console.log("{", code, ":", " { data:", this.codeTable[type][code].data, "} }");
        } else {
            console.log("{", code, "}");
        }
    }
};

_Method.print = function (text, placeHolder) {
    if (undefined !== placeHolder) {
        console.log(text, placeHolder);
    } else {
        console.log(text);
    }
};

_Method.getTextByCode = function (type, code) {
    var text = "";
    if (true === this.allowedTypes[type]) {
        if ('text' === this.printCodes) {
            text = this.codeTable[type][code].str.replace("%s", this.codeTable[type][code].data);
        } else if ('code' === this.printCodes) {
            text = (code);
        } else if ('rpc' === this.printCodes) {
            text = ("{", code, "}");;
        }
    }
    return text;
};

_Method.setAllowed = function (allowed) {
    if (allowed !== undefined) {
        this.allowedTypes = allowed;
    }
};

_Method.setDataPort = function (code, data) {
    try {
        this.portTable["pPort_" + code] = data.toString();
    } catch (e) {
        //Nothing
    }
    this.codeTable = this.updateCodeTable(this.portTable);
};

module.exports = VIEW_Console;
