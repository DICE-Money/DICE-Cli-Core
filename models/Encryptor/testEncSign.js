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

//1. Set Static keys
var keysMiner = {private:"bae4d414922260ce5390e7e89867a5aa4deae9d9", public:"0259b056e33f3bb7947f54acb6729e613578d38c"};
var keysOperator = {private:"a3f7e2ada1100f49543e823c4b3bfa7922695e69",public:"03ba8b4532663c10e010832fec4fa6f0e8303fd9"};

//2.1. Create Instance of encryptor (Miner side)
var enc_M = new modEncryptor(keysMiner);

//2.2. Create Instance of encryptor (Operator side)
var enc_O = new modEncryptor(keysOperator);

//3. Miner prepare signed and encrypted data to Operator
//   Miner knows only public key !
var certificateMiner = enc_M.getKeyExchangeCerificate(keysOperator.public);
console.log("Miner Certificate:",JSON.stringify(certificateMiner));

//4. Operator receives Certificate and try to accpet it
//   Operator knows only public key
var bigCertificate = enc_O.acceptKeyExchangeCertificate(certificateMiner,keysMiner.public);
console.log("Operator accept certificate:", bigCertificate);