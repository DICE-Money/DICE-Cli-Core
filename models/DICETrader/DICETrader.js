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