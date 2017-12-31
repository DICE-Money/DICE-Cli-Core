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

var tcp = require('./TcpWorker.js');
var tcp = require('./TcpWorker.js');
var modBase58 = require('../Base58/Base58.js');
modBase58 = new modBase58();

var client = new tcp();
var client2 = new tcp();
var server = new tcp();

const modEnc = require('../Encryptor/Encryptor.js');
//const crypto = require('crypto');
//const modBS58 = require('bs58');

var servere = {};
var cliente = {};

// 1. Init Key and Address
servere.key= "0375ad26168b0b033486d27f3a97beb795";
servere.add = "02072924ed209e79e8b37694f41bf4b148d3e9c1";

cliente.key = "060bc474f79b351d921cb9dd2bdb7ea5";
cliente.add = "030561b4bc18e3c56b80903392820d9c609b9442";

// 2. Set Secret Message
var testMsg = "Hello World!";

// 3. Create Encryptors
var enc1 = new modEnc(Buffer.from(servere.key, 'hex'), 'sect131r1', 2);
var enc2 = new modEnc(Buffer.from(cliente.key, 'hex'), 'sect131r1', 2);

// 4. Encrypt Message with first pair & Decrypt
//var encrypted1 = enc1.encryptDataPublicKey(testMsg, Buffer.from(, 'hex'));
//var decrypted1 = enc1.decryptDataPublicKey(encrypted1, Buffer.from(add2, 'hex'));

//// 5. Encrypt Message with second pair & Decrypt
//var encrypted2 = enc2.encryptDataPublicKey(testMsg, Buffer.from(add1, 'hex'));
//var decrypted2 = enc2.decryptDataPublicKey(encrypted2, Buffer.from(add1, 'hex'));



const cCommands = {
  "Time": {
    desc: 'Return current time on server',
    exec: (data) => {
      return new Date().toString();
    }
  },
  "Zeroes": {
    desc: 'Return traling zeroes',
    exec: (data) => {
      var zeroes = 12;
      return zeroes.toString();
    }
  },
  "Sum": {
    desc: 'Return traling zeroes',
    exec: (data, addr) => {
      var decrypted2 = enc1.decryptDataPublicKey(Buffer.from(data), Buffer.from(modBase58.encode(addr)));
      data = decrypted2.toString() + "Encryption works";
      var encrypted2 = enc1.encryptDataPublicKey(data, Buffer.from(modBase58.encode(addr)));
      return encrypted2;
    }
  }
};

server.create("server", "127.0.0.1", "1993", cCommands);
client.create("client", "127.0.0.1", "1993", () => {});
client2.create("client", "127.0.0.1", "1993", () => {});

var serverPair = {
  "privateKey": "oNL9xvNEwsUSyGZLuQY5vU",
  "digitalAdress": "2eAvZamZ1aVhSDCbXVJ9ZbPrdXS"
};
var clientPair = {
  "privateKey": "2xMy3aJ6mUtssE8NDtwTLpY",
  "digitalAdress": "2d8dQNYt1W2z5QQtUASqQ8TeqXN"
};
console.log(server.getCommands());

function periodicNonEncrypted() {

  var encrypted1 = enc2.encryptDataPublicKey(testMsg, Buffer.from(modBase58.encode(serverPair.digitalAdress)));
  client2.Request("Sum", cliente.add, encrypted1);
  data = client2.readByAddress(cliente.add);
  if (data !== undefined) {
    var decrypted1 = enc2.decryptDataPublicKey(Buffer.from(data), Buffer.from(modBase58.encode(serverPair.digitalAdress)));
    console.log("Client2", decrypted1.toString());
  }

}


setInterval(periodicNonEncrypted, 1000);