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
            console.log("{", code,"}");
        }
    }
};

_Method.print = function (text, placeHolder) {
    console.log(text, placeHolder);
};

_Method.getTextByCode = function (type, code) {
    var text = "";
    if (true === this.allowedTypes[type]) {
        text = this.codeTable[type][code].str.replace("%s", this.codeTable[type][code].data);
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
