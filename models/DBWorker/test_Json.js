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

const modDB = require('./DBWorker_Json.js');

var db = new modDB();

//Init db
db.initializeDB('diceDB.json','json');

//Add unit
db.addDICEProto("2eAvZamZ1aVhSDCbXVJ9ZbPrdXS" , "niko", "ssss");

//Check is empty
var data = db.isNewOwnerEmpty("2eAvZamZ1aVhSDCbXVJ9ZbPrdXS88");
console.log(data);

//Ready data back from DB
var data = db.getDICEProto("2eAvZamZ1aVhSDCbXVJ9ZbPrdXS");
console.log(data);

//Get newOwner
var data = db.getNewOwner("2eAvZamZ1aVhSDCbXVJ9ZbPrdXS");
console.log(data);

//Write New Owner and check data back
db.writeNewOwner("2eAvZamZ1aVhSDCbXVJ9ZbPrdXS", "shososho");
var data = db.getNewOwner("2eAvZamZ1aVhSDCbXVJ9ZbPrdXS");
console.log(data);

//Drop The Table
db.clean();