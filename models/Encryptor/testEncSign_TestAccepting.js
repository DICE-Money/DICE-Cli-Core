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

const modEncryptor = require('./Encryptor_Signer.js');
const secp160k1 = require('../AddressCalculator/Secp160k1.js');

var digitalAdressWorker_160k1 = new secp160k1();


for (var i = 0; i < 10000; i++) {

    digitalAdressWorker_160k1.genarateKeys();
    var keysMiner = digitalAdressWorker_160k1.getKeyPair();
    digitalAdressWorker_160k1.genarateKeys();
    var keysOperator = digitalAdressWorker_160k1.getKeyPair();

    var enc_M = new modEncryptor(keysMiner);
    var enc_O = new modEncryptor(keysOperator);

    try{
        var certificateMiner = enc_M.getKeyExchangeCertificate(keysOperator.public);
        var bigCertificate = enc_O.acceptKeyExchangeCertificate(certificateMiner, keysMiner.public);
    }catch(e){
        throw "Acccpeting BREAK! FATAL ERROR";
        console.log(JSON.stringify(keysMiner), keysMiner.private.length);
        console.log(JSON.stringify(keysOperator),keysOperator.private.length );
    }
}