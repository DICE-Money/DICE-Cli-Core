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
/* javascript-obfuscator:enable */

//Class access 
var _Method = ContactWorker.prototype;

//Local const
const cConfigLocal = "./configuration.json";
const cDefaultConfigJson =
        {
            Name: "undefined",
            Keys: "pathToKeys",
            Contacts: {},
            Operators: {}
        };
const lengthOfDA = (20 * 2) + 7;

function ContactWorker(pathToConfig) {
    this._pathConfig = pathToConfig;
    this._configuration = cDefaultConfigJson;
    this.InitConfig();
    this.watchFile;
}

_Method.StartAutoUpdate = function () {
    this.watchFile = modFs.watchFile(this._pathConfig, () => {
        try {
            var config = modFs.readFileSync(this._pathConfig);
            this._configuration = JSON.parse(config);
        } catch (e) {
            console.log("Error Updating");
        }
    });
};

_Method.StopAutoUpdate = function () {
    this.watchFile.close();
};

_Method.CreateNewConfig = function (cfgData) {
    this._pathConfig = cfgData.Path;
    this.SetName(cfgData.Name);
    this.SetKeysPath(cfgData.Keys);
    this.Save();
    this.InitConfig();
};

_Method.InitConfig = function (pathToConfig) {
    try {
        if (pathToConfig === undefined) {
            var config = modFs.readFileSync(this._pathConfig);
            this._configuration = JSON.parse(config);
        } else {
            this._configuration = JSON.parse(pathToConfig);
            this._pathConfig = pathToConfig;
        }
    } catch (e) {
        //Nothing the configuration is invalid
    }
};

_Method.GetOperators = function () {
    return this._configuration.Operators;
};

_Method.GetContacts = function () {
    return this._configuration.Contacts;
};

_Method.GetContactAddr = function (name) {
    return this._configuration.Contacts[name];
};

_Method.GetOperatorAddr = function (name) {
    return this._configuration.Operators[name];
};

_Method.GetContactName = function (DA) {
    for (const key of Object.keys(this._configuration.Contacts)) {
        if (DA === this._configuration.Contacts[key]) {
            return key;
        }
    }
};

_Method.GetOperatorName = function (DA) {
    for (const key of Object.keys(this._configuration.Operators)) {
        if (DA === this._configuration.Operators[key]) {
            return key;
        }
    }
};

_Method.AddContact = function (contact) {
    if (Object.values(this._configuration.Contacts).indexOf(contact.DA) === -1) {
        if (contact.DA.length === lengthOfDA) {
            this._configuration.Contacts[contact.Name] = contact.DA;
            this.Save();
        }
    }
};

_Method.AddOperator = function (operator) {
    if (Object.values(this._configuration.Operators).indexOf(operator.DA) === -1) {
        if (operator.DA.length === lengthOfDA) {
            this._configuration.Operators[operator.Name] = operator.DA;
            this.Save();
        }
    }
};

_Method.RemoveContact = function (contact) {
    delete this._configuration.Contacts[contact];
    this.Save();
};

_Method.RemoveOperator = function (operator) {
    delete this._configuration.Operators[operator];
    this.Save();
};

_Method.Save = function (path) {
    if (path === undefined) {
        modFs.writeFileSync(this._pathConfig, JSON.stringify(this._configuration));
    } else {
        modFs.writeFileSync(path, JSON.stringify(this._configuration));
    }
};

_Method.GetOperatorsToString = function () {
    var returnString = "";
    for (const key of Object.keys(this._configuration.Operators)) {
        returnString += `Name: ${key} Digital Address: ${this._configuration.Operators[key]} \n`;
    }
    return returnString;
};

_Method.GetContactsToString = function () {
    var returnString = "";
    for (const key of Object.keys(this._configuration.Contacts)) {
        returnString += `Name: ${key} Digital Address: ${this._configuration.Contacts[key]} \n`;
    }
    return returnString;
};

_Method.SetName = function (name) {
    this._configuration.Name = name;
    this.Save();
};

_Method.SetKeysPath = function (keys) {
    this._configuration.Keys = keys;
    this.Save();
};

_Method.GetName = function () {
    return this._configuration.Name;
};

_Method.GetKeysPath = function () {
    return this._configuration.Keys;
};

_Method.Purge = function () {
    this._configuration = cDefaultConfigJson;
    this.CreateNewConfig(this._pathConfig);
};

_Method.ImportContacts = function (pathToConfig) {
    try {
        if (pathToConfig !== undefined) {
            var config = modFs.readFileSync(pathToConfig);
            var remoteConfig = JSON.parse(config);
            for (const key of Object.keys(remoteConfig.Contacts)) {
                this.AddContact({Name: key, DA: remoteConfig.Contacts[key]});
            }
        }
    } catch (e) {
        //Nothing the configuration is invalid
    }
};

_Method.ImportOperators = function (pathToConfig) {
    try {
        if (pathToConfig !== undefined) {
            var config = modFs.readFileSync(pathToConfig);
            var remoteConfig = JSON.parse(config);
            for (const key of Object.keys(remoteConfig.Operators)) {
                this.AddOperator({Name: key, DA: remoteConfig.Operators[key]});
            }
        }
    } catch (e) {
        console.log(e);
        //Nothing the configuration is invalid
    }
};

_Method.ImportOperatorsAndContacts = function (pathToConfig) {
    this.ImportContacts(pathToConfig);
    this.ImportOperators(pathToConfig);
};

_Method.ExportContacts = function (pathToConfig) {
    modFs.writeFileSync(pathToConfig, JSON.stringify({Contacts: this._configuration.Contacts}));
};

_Method.ExportOperators = function (pathToConfig) {
    modFs.writeFileSync(pathToConfig, JSON.stringify({Operators: this._configuration.Operators}));
};

module.exports = ContactWorker;
