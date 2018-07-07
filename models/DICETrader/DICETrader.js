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
const modBase58 = require('../Base58/Base58.js');
const modFs = require('fs');
/* javascript-obfuscator:enable */

//Class access 
var _Method = DICETrader.prototype;

//Local const
const cDiceTraderTypes = {client: 'client', server: 'server'};
const Bs58 = new modBase58();
//const cOwnerLessStates =
//        {
//            eState_RequestToServer: 0,
//            eState_Exit: 1,
//            eState_Count: 2
//        };
function DICETrader(type) {
    this.type = cDiceTraderTypes[type];
    this.isRequestTransmitted = false;
    this.modules = {client: {}, server: {}};
}

//Public Methods
_Method.setModules = function (TCPClient, DICEValue, Encryptor) {
    this.modules[this.type].tcpIp = TCPClient;
    this.modules[this.type].diceValue = DICEValue;
    this.modules[this.type].encryptor = Encryptor;
};

_Method.tradeCurrentOwner = function () {
    if (this.type === cDiceTraderTypes.client) {

    } else if (this.type === cDiceTraderTypes.server) {

    }
};

_Method.tradeNewOwner = function () {
    if (this.type === cDiceTraderTypes.client) {

    } else if (this.type === cDiceTraderTypes.server) {

    }
};

_Method.tradeOwnerLess = function (addrOp, keyPair, DICE) {
    if (this.type === cDiceTraderTypes.client) {
        //Start scheduled program
        var isReady = false;
        var inst = this;
        
        while(!isReady) {
            inst.requestToServer(addrOp, keyPair.digitalAddress,
                    (addr) => {
                var claimData = {};
                //Set DICE Unit to Dice validatior
                inst.modules[inst.type].diceValue.setDICEProtoFromUnit(DICE);

                claimData["diceProto"] = inst.modules[inst.type].diceValue.getDICEProto().toBS58();
                var encryptedData = inst.modules[inst.type].encryptor.encryptDataPublicKey(JSON.stringify(claimData), Buffer.from(Bs58.decode(addrOp)));
                inst.modules[inst.type].tcpIp.Request("SET CurrentReleaseOwnerless", addr, encryptedData);
            },
                    (response) => {
                printServerReturnData(response);
                isReady = true;
            });
        }
    } else if (this.type === cDiceTraderTypes.server) {

    }
};

//General Use Function to work properly with server
_Method.requestToServer = function (addrOp, addrMiner, activate, deactivate) {
    var receivedData;
    if (false === this.isRequestTransmitted) {
        activate(addrMiner);
        this.isRequestTransmitted = true;
        console.log(this.modules[this.type].tcpIp);
    } else {
        receivedData = this.modules[this.type].tcpIp.readByAddress(addrMiner);
        if (receivedData !== undefined) {
            this.isRequestTransmitted = false;
            receivedData = this.modules[this.type].encryptor.decryptDataPublicKey(this.modules[this.type].encryptor.from(receivedData), Buffer.from(Bs58.decode(addrOp)));
            deactivate(receivedData);
        }
    }
    return receivedData;
};

module.exports = DICETrader;