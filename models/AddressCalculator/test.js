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

const modDigAddr = require('./DigitalAdressCalculator_ECDH.js');

var addrWorker = new modDigAddr();

addrWorker.CalculateKeyAdressPair();

console.log(addrWorker.getPrivateKey('bs58').length);
console.log(addrWorker.getDigitalAdress('bs58').length);

console.log(addrWorker.getPrivateKey('hex'));
console.log(addrWorker.getDigitalAdress('hex'));

var counter = 1;
console.log("Starting");

function testLenght(){
    addrWorker.CalculateKeyAdressPair();
    var len = addrWorker.getDigitalAdress('').length;
    if (len !== 20){
        throw "Breaking the logic";
    }
    
    if (counter <= 1000000)
    {
        console.log(counter++);
        console.log(addrWorker.getDigitalAdress('hex'));
    }
    else
    {
        throw "Checked 1 000 000 Times";
    }
}

while(true){
    testLenght();
}