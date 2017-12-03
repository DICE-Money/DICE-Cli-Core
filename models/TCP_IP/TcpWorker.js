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
const modNet = require('net');

//Class access 
var _Method = TcpWorker.prototype;

//Local const
const cCommands =
        {"GET Time":
                    {
                        desc: 'Return current time on server',
                        exec: () =>
                        {
                            return new Date().toString();
                        }
                    },
            "SET Data":
                    {
                        desc: 'Set data to server by Address',
                        exec: (data) =>
                        {
                            return sliceDataByAddr(data);
                        }
                    }
        };

const cSchedulerWorkMs = 10;
const cEndOfBuffer = '#';
const cCommandSeparator = '@';
const cDataBufferSeparator = ':';

//Constructor
function TcpWorker() {
    this.worker = undefined;
    this.type = undefined;
    this.sharedBuffer = {'client': undefined, 'server': undefined};
}

//Private
function createClient(ip, port) {
    var client = new modNet.Socket();
    client.connect(port, ip, function () {});
    return client;
}

function createServer(ip, port) {
    var server = modNet.createServer();
    server.listen(port, ip);
    return server;
}

function generalCallbacks(tcpWorker) {
    tcpWorker.on('close', function () {
        console.log('connection closed');
    });

    tcpWorker.on('error', function () {
        console.log('Error');
    });
}

function sliceDataByAddr(data) {
    var text = data.toString();
    var splitedText = text.split(cEndOfBuffer);
    var data = {};
    var buf = {};
    for (var i = 0; i < splitedText.length - 1; i++)
    {
        buf = JSON.parse(splitedText[i]);
        data[buf.addr] = {command: buf.command, data: buf.data};
    }
    return data;
}

function dataCallbacks(tcpWorker, type, buffer) {
    if (type === 'client') {
        tcpWorker.on('data', function (data) {
            buffer[type] = data.toString();
        });

    } else {
        tcpWorker.on('connection', (c) => {
            c.on('data', (data) => {
                try {
                    var returnData = cCommands[data.toString()].exec();
                    c.write(returnData);
                } catch (e) {
                    buffer[type] = (cCommands['SET Data'].exec(data));
                }
            });
        });
    }
}

//Public
_Method.create = function (serverOrClient, ip, port) {
    if ("server" === serverOrClient) {
        this.type = 'server';
        this.worker = createServer(ip, port);
    } else if ("client" === serverOrClient) {
        this.type = 'client';
        this.worker = createClient(ip, port);
    } else {
        throw "Invalid return request! Try \'server\' !";
    }

    //set general callbacks
    generalCallbacks(this.worker);

    //data managment callbacks
    dataCallbacks(this.worker, this.type, this.sharedBuffer);

};

_Method.GET = function (command) {
    if (this.type === 'client') {
        this.worker.write(command);
    }
};

_Method.SET = function (command, clientAddr, dataBuffer) {
    if (this.type === 'client') {
        var data = {};
        data = ({addr: clientAddr, command: command, data: dataBuffer});
        this.worker.write(JSON.stringify(data) + cEndOfBuffer);
    }
};

_Method.getCommands = function () {
    return cCommands;
};

_Method.readRaw = function () {
    if (this.type === 'client') {
        var buffer;
        buffer = this.sharedBuffer[this.type];
        this.sharedBuffer[this.type] = undefined;
        return buffer;
    }
};

_Method.readByAddress = function (clientAddress) {
    if (this.type === 'server') {
        var buffer;
        try {
            buffer = this.sharedBuffer[this.type][clientAddress].data;
            this.sharedBuffer[this.type][clientAddress] = undefined;
        } catch (e) {
            //Nothing at the moment
        }
    }
    return buffer;
};

module.exports = TcpWorker;