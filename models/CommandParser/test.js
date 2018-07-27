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

//Requires
const addContext = require('mochawesome/addContext');
const modCommandWorker = require('./CommandParser.js');
const modAssert = require("assert");

//Data stored buffer from console arguments
const Args =
{
    nameOfOwner: undefined,
    keyPair: undefined,
    diceUnit: undefined
};

const CommandsTable =
    [
        //Configration and adressbook
        { args: ['-cCfg', '--createConfiguration'], dataArgs: ['nameOfOwner', 'keyPair', 'configurationFile'], exec: 'funcCreateCfg', help: "Create Configuration of the current owner." },
        { args: ['-uCfg', '--updateConfiguration'], dataArgs: ['nameOfOwner', 'keyPair', 'configurationFile'], exec: 'funcUpdateCfg', help: "Update Configuration of the current owner.(Do not delete existing contacts and operators!)" },
    ];

describe("Test general functionality of Command Worker model", function () {

    it("Get function name VALID", function () {
        var CommandParser = new modCommandWorker(["odd", "odd", CommandsTable[0].args[0]], Args);
        var functionName = CommandParser.getExecFuncByTable(CommandsTable);
        modAssert.equal(functionName, CommandsTable[0].exec);
    });

    it("Get function name INVALID", function () {
        var CommandParser = new modCommandWorker(["odd", "odd", CommandsTable[1].args[0]], Args);
        var functionName = CommandParser.getExecFuncByTable(CommandsTable);
        modAssert.notEqual(functionName, CommandsTable[0].exec);
    });

    it("Print Help menu", function () {
        var CommandParser = new modCommandWorker(["odd", "odd", CommandsTable[1].args[0]], Args);
        var help = CommandParser.getHelpString(CommandsTable);
        CommandsTable.forEach(element => {
            if(help.indexOf(element.help) === -1){
                throw new Error("Help is not relevant");
            }
        });
    });

});