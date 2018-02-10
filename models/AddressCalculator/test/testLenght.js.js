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
const modCrypto = require('crypto');
const modBS58 = require('bs58');
const lzw = require("node-lzw");
var zlib = require('zlib');

console.log("Start");
var curves = modCrypto.getCurves();
//for (var i = 0; curves.length; i++)
//{
//    try{
var addresses = {};
var data = [];
function getAddres(i) {
    var isInvalid = true;
    var invalidTries = 0;
    
    while (isInvalid) {
        cECDH = modCrypto.createECDH("secp521r1");
        cECDH.generateKeys();
        var pubKey = cECDH.getPublicKey(null,"compressed");
        //console.log(pubKey[0],pubKey[1]);
    //    if (pubKey[0]=== 1 && pubKey[1] === 0)
  //      {
            console.log(pubKey.toString("hex"),pubKey.length);
   //     }
    }
    
    if (addresses.hasOwnProperty(encoded))
    {
        addresses[encoded]=invalidTries;
        data[i]=invalidTries;
    }
    else
    {
        throw "Duplicated Addresses !!!";
    }
}

var zlib = require('zlib');
var input = "Hellow world";

var deflated = zlib.deflateSync(input);
var inflated = zlib.inflateSync(new Buffer(deflated, 'base64')).toString();

console.log("Gzip compressed ",deflated.length);
getAddres(0);
//for (var i =0; i< 10000; i++)
//{
//    getAddres(i);
//    console.log(i);
//}

//Calculate Average Invalid tries
var average = 0;

for (var i =0; i<addresses.length;i++)
{
    average += data[i];
}
average = average /data.length;

console.log(average);

console.log(JSON.stringify(addresses));

console.log("End");