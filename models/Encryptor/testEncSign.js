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
//1. Set Static keys
    digitalAdressWorker_160k1.genarateKeys();
    var keysMiner = digitalAdressWorker_160k1.getKeyPair();
    digitalAdressWorker_160k1.genarateKeys();
    var keysOperator = digitalAdressWorker_160k1.getKeyPair();

//2.1. Create Instance of encryptor (Miner side)
    var enc_M = new modEncryptor(keysMiner);

//2.2. Create Instance of encryptor (Operator side)
    var enc_O = new modEncryptor(keysOperator);

//3. Miner prepare signed and encrypted data to Operator
//   Miner knows only public key !
    console.time("Prepare Certificate");
    var certificateMiner = enc_M.getKeyExchangeCertificate(keysOperator.public);
    console.timeEnd("Prepare Certificate");
    console.log("Miner Certificate:", JSON.stringify(certificateMiner));

//4. Miner prepare signed and encrypted data to Operator
//   Miner knows only public key !
    var certificateOperator = enc_O.getKeyExchangeCertificate(keysMiner.public);
    console.log("Operator Certificate:", JSON.stringify(certificateOperator));

//5. Operator receives Certificate and try to accpet it
//   Operator knows only public key
    console.time("Accept Certificate");
    var bigCertificate = enc_O.acceptKeyExchangeCertificate(certificateMiner, keysMiner.public);
    console.timeEnd("Accept Certificate");
    console.log("Operator accept certificate:", bigCertificate);

//6. Operator receives Certificate and try to accpet it
//   Operator knows only public key
    var bigCertificate = enc_M.acceptKeyExchangeCertificate(certificateOperator, keysOperator.public);
    console.log("Miner accept certificate:", bigCertificate);

//7. Try to encrypt some data with new certificates (Miner)
    var testString = "Hello Operator";
    var encrypted_M = enc_M.encryptDataPublicKey(testString, keysOperator.public);
    console.log("Miner encrypt message:", encrypted_M);

//8. Try to decrypt some data with new certificates (Operator)
    var decrypted_O = enc_O.decryptDataPublicKey(encrypted_M, keysMiner.public);
    console.log("Operator decrypt message:", decrypted_O.toString("hex"));

//9. Return reply to miner (Operator)
    testString = "Hello Miner";
    console.time("Encryption");
    var encrypted_O = enc_O.encryptDataPublicKey(testString, keysMiner.public);
    console.timeEnd("Encryption");
    console.log("Operator encrypt message:", encrypted_O);

//8. Try to decrypt some data with new certificates (Miner)
    console.time("Decryption");
    var decrypted_M = enc_M.decryptDataPublicKey(encrypted_O, keysOperator.public);
    console.timeEnd("Decryption");
    console.log("Miner decrypt message:", decrypted_M.toString("hex"));
}