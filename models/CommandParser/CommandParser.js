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
var _Method = CommandParser.prototype;

//Local const
const cOddArgs = 2;

//General Constuctor
function CommandParser(commandArgs, appArgs) {
    this.commandArgs = commandArgs.slice(cOddArgs);
    this.appArgs = appArgs;
}

//Public Methods
_Method.getExecFuncByTable = function (table) {
    var execFunc = 'ERROR';
    for (var i = 0; i < table.length; i++) {
        if (true === (table[i].args.includes(this.commandArgs[0]))) {
            this.setDatArgs(table[i]);

            //Check is program has enought arguments
            if (this.commandArgs.length >= table[i].dataArgs.length) {
                execFunc = table[i].exec;
                break;
            }
        }
    }
    return execFunc;
};

_Method.setDatArgs = function (tableElement) {
    var dataSaved = '';
    for (var i = 0; i < tableElement.dataArgs.length; i++) {
        dataSaved = tableElement.dataArgs[i];
        this.appArgs[dataSaved] = this.commandArgs[i + 1];
    }
};

_Method.getHelpString = function (table) {
    var text = '';
    for (var i = 0; i < table.length; i++) {
        text += "  ";
        text += table[i].args.toString();
        text += "\n     " + table[i].help;
        text += "\n     Usage: <application> <"+ table[i].args.join(' or ') +"> <" + table[i].dataArgs.join('> <') + ">\n\n";
    }
    return text;
};

_Method.getArgs = function () {
    return this.appArgs;
};

_Method.getState = function () {
    return this.appStates;
};

module.exports = CommandParser;
