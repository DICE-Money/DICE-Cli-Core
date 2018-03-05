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


const cntWorker = require('./ContactsWorker.js');

// 1. Init Config
var inst = new cntWorker("./configuration.json");

//2. Add Random Operators
console.log("Add Operators");
inst.AddOperator({Name: "Misho", DA: "76640-bcfe5-47604-75a2e-c0a6c-90df2-c39ef-97718"});
inst.AddOperator({Name: "Tony", DA: "76640-bcfe5-47004-75a2e-c0a6c-90df2-c39ef-97718"});
inst.AddOperator({Name: "Konstantin", DA: "76640-bcfe5-47604-72a2e-c0a6c-90df2-c39ef-97718"});
inst.AddOperator({Name: "Dillip", DA: "76640-bcfe5-47904-75a2e-c0a6c-90df2-c39ef-97718"});
console.log(inst.GetOperatorsToString());

//3. Remove Operatorsa
console.log("Remove Operators");
inst.RemoveOperator("Gosho");
console.log(inst.GetOperatorsToString());

//4. Export
inst.ExportOperators("./configuration_remote.json");

//5. Purge config
inst.Purge();
console.log(inst.GetOperatorsToString());

//6. Import back
inst.ImportOperators("./configuration_remote.json");
console.log(inst.GetOperatorsToString());