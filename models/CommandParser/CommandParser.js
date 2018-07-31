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
var _Method = CommandParser.prototype;

//Local const
const cOddArgs = 2;

//General Constuctor
function CommandParser(commandArgs, appArgs, table) {
    this.commandArgs = commandArgs.slice(cOddArgs);
    this.appArgs = appArgs;

    //Table is optional
    if (table) {
        this.execFunc = this.getExecFuncByTable(table);
    }
}

//Public Methods
_Method.getExecFuncByTable = function (table) {
    var execFunc = 'ERROR';
    for (var i = 0; i < table.length; i++) {
        if (true === (table[i].args.includes(this.commandArgs[0]))) {
            this.setDatArgs(table[i], false);
            //Check is program has enought arguments
            if (this.commandArgs.length != 0) {
                execFunc = table[i].exec;
                break;
            }
        } else if (true === (table[i].args.includes(this.commandArgs[1]))) {
            this.setDatArgs(table[i], true);
            //Check is program has enought arguments
            if (this.commandArgs.length != 0) {
                execFunc = table[i].exec;
                break;
            }
        }
    }
    return execFunc;
};

_Method.filterInputArgument = function (argument, filter) {
    //Check filter 
    // Is data valid by filter ? 
    if (typeof filter === "function" && false === filter(argument)) {
        throw new Error(`Invalid argument ${argument}`);
    }
    return argument;
};

_Method.setDatArgs = function (tableElement, isNexeBuild) {
    var dataSaved = '';
    var intOffset = 1;
    for (var i = 0; i < tableElement.dataArgs.length; i++) {
        dataSaved = tableElement.dataArgs[i];
        if (true === isNexeBuild) {
            intOffset = 2;
        }
        if (this.appArgs[dataSaved]) {
            this.appArgs[dataSaved] = this.filterInputArgument(this.commandArgs[i + intOffset], this.appArgs[dataSaved].filter);
        } else {
            this.appArgs[dataSaved] = this.filterInputArgument(this.commandArgs[i + intOffset]);
        }
    }
};

_Method.getHelpString = function (table) {
    var text = '';
    for (var i = 0; i < table.length; i++) {
        text += "  ";
        text += table[i].args.toString();
        text += "\n     " + table[i].help;
        text += "\n     Usage: <application> <" + table[i].args.join(' or ') + "> <" + table[i].dataArgs.join('> <') + ">\n\n";
    }
    return text;
};

_Method.getArgs = function () {
    return this.appArgs;
};

_Method.getState = function () {
    return this.appStates;
};

_Method.getExecFunc = function () {
    return this.execFunc;
};

module.exports = CommandParser;
