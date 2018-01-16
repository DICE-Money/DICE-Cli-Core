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

const modDB = require('./DBWorker_MySql_Async.js');

var db = new modDB();

//Configure new DB
db.configDB("localhost", "diceUser", "DfIoKeVfk7P8JXKc");

//Create New DB
db.createDB('3SEdktQGS4K947PUadvbHFD2oJGdsada', add);

//Add unit
function add() {
    db.addDICEProto("2eAvZamZ1aVhSDCbXVJ9ZbPrdXS", "niko", "ssss", isEmpty);
}

//Check is empty
function isEmpty() {
    db.isNewOwnerEmpty("2eAvZamZ1aVhSDCbXVJ9ZbPrdXS", (data) => {
        console.log(data);
        getDice();
    });
}

//Ready data back from DB
function getDice() {
    db.getDICEProto("2eAvZamZ1aVhSDCbXVJ9ZbPrdXS", (data) => {
        console.log(data);
        getNewOwner();
    });
}

//Get newOwner
function getNewOwner() {
    db.getNewOwner("2eAvZamZ1aVhSDCbXVJ9ZbPrdXS", (data) => {
        console.log(data);
        writeNewOwner();
    });
}

function writeNewOwner() {
//Write New Owner and check data back
    db.writeNewOwner("2eAvZamZ1aVhSDCbXVJ9ZbPrdXS", "shososho", (data) => {
        db.getNewOwner("2eAvZamZ1aVhSDCbXVJ9ZbPrdXS", (data) => {
            console.log(data);
            //db.clean(finish);
        });
    });
}

function finish()
{
    console.log("End");
}