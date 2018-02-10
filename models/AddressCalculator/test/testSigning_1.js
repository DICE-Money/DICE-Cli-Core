/* 
 * Copyright (c) 2018, Mihail Maldzhanski
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

const crypto = require('crypto');
const fs = require('fs');
const sign = crypto.createSign('SHA256');
const verify = crypto.createSign('SHA256');

cECDH = crypto.createECDH("secp256k1");


for (var i = 0; i < 1000; i++){
    
    console.log(cECDH.getPublicKey("hex","compressed"));
}
//const dataToSign = 'some data to sign';
//
//sign.write(dataToSign);
//sign.end();
//
//var privateKeyEC = cECDH.getPrivateKey().toString('base64');
//var privateKey1 = privateKeyEC.slice(0,54);
//var privateKey2 = privateKeyEC.slice(54);
//console.log(privateKeyEC, privateKeyEC.length );
//const privateKey = `-----BEGIN EC PRIVATE KEY-----
//MFMCAQEEFQ${privateKeyEC}
//-----END EC PRIVATE KEY-----`;
//const signOfData = sign.sign(privateKey, 'hex');
//console.log(privateKey);
//
//console.log(Buffer.from(`MFICAQEEFEXwraAoMCn3cK3f/C/VG61mgG0hoAcGBSuBBAACoS4DLAAEBqx10kRh
//dNxUT54ttw99EK9h2ofwAuvVsnFKRKurzal73nOIZWm82VK3`).toString('hex'));

//------------end signing------------------

//----------Verifying----------------------
//
//verify.write(dataToSign);
//verify.end();
//
//const publicKey = cECDH.getPublicKey("hex","compressed");
//const signature = signOfData;
//console.log(sign.verify(privateKey, signature));
