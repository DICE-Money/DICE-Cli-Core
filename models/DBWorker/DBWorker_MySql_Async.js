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

//Required
const modFs = require('fs');
const modMySql = require('mysql');

//Class access 
var _Method = DBWorker_MySql_Async.prototype;

//Local const
const cDB_Name = "DICE_DB";
const cDB_Table_Columns =
        {
            id: {name: "id"},
            hash: {name: "hash"},
            proto: {name: "proto"},
            curOwner: {name: "curOwner"},
            newOwner: {name: "newOwner"},
            modified: {name: "created"}
        };
const cDice_Table_Prefix = "operator_";

//Construtor
function DBWorker_MySql_Async() {
    this.connection = undefined;
    this.table = undefined;
    this.config = undefined;
    this.addrOp = undefined;
}

//Private Methods
function _checkForNull(data) {
    if (data === null) {
        throw "Cannot be Null!";
    }
    return data;
}

//Public Methods
_Method.clean = function (finishCallback) {
    var sql = `DROP TABLE ${this.table}`;
    this.connection.query(sql, finishCallback);
};

_Method.remove = function (hashOfProto, finishCallback) {
    var sql = `DELETE FROM ${this.table} WHERE WHERE ${cDB_Table_Columns.hash.name}="${hashOfProto}`;
    this.connection.query(sql, finishCallback);
};

//MySqL Database
_Method.configDB = function (host, user, password) {
    this.config = {
        host: _checkForNull(host),
        user: _checkForNull(user),
        password: _checkForNull(password)
    };
};

_Method.createDB = function (addrOp, finishCallback) {

    //Establish connection
    this.connection = modMySql.createConnection(this.config);
    this.addrOp = addrOp;
    
    //Local data
    var sql = "";

    //Set addrOp (Used for table creation)
    this.table = cDice_Table_Prefix + _checkForNull(addrOp);

    //Send request to create DATABSE
    sql = `CREATE DATABASE IF NOT EXISTS ${cDB_Name}`;
    this.connection.query(sql, dbCreation);

    //Change DB Name
    this.connection = modMySql.createConnection({
        host: this.config.host,
        user: this.config.user,
        password: this.config.password,
        database: cDB_Name
    });

    var connection = this.connection;

    //After DB was cheked, we need to create Table 
    function dbCreation() {

        //Send request to create DATABSE
        var sql = `CREATE TABLE IF NOT EXISTS operator_${addrOp} 
               (${cDB_Table_Columns.id.name} INT NOT NULL AUTO_INCREMENT PRIMARY KEY, 
                ${cDB_Table_Columns.hash.name} VARCHAR(255), 
                ${cDB_Table_Columns.proto.name} VARCHAR(512), 
                ${cDB_Table_Columns.curOwner.name} VARCHAR(40), 
                ${cDB_Table_Columns.newOwner.name} VARCHAR(40),
                ${cDB_Table_Columns.modified.name} DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP)`;

        connection.query(sql, finishCallback);
    }
};


_Method.getDICEProto = function (hashOfProto, finishCallback) {
    //Create Sql request
    var dataSql = `SELECT * FROM ${this.table} WHERE ${cDB_Table_Columns.hash.name}="${hashOfProto}" `;
    var connection = this.connection;
    connection.query(dataSql, returnData);

    //Get CurOwner
    function returnData(err, res, fie) {
        var diceProto = res[0];
        finishCallback(diceProto);
    }
};

_Method.getNewOwner = function (hashOfProto, finishCallback) {
    //Create Sql request
    var dataSql = `SELECT * FROM ${this.table} WHERE ${cDB_Table_Columns.hash.name}="${hashOfProto}" `;
    var connection = this.connection;
    connection.query(dataSql, returnData);

    //Get NewOwner
    function returnData(err, res, fie) {
        try {
            var newOwner = res[0][cDB_Table_Columns.newOwner.name];
        } catch (e) {
            //Nothing
            //The Item does not exist
        }
        finishCallback(newOwner);
    }
};

_Method.getCurrentOwner = function (hashOfProto, finishCallback) {
    //Create Sql request
    var dataSql = `SELECT * FROM ${this.table} WHERE ${cDB_Table_Columns.hash.name}="${hashOfProto}" `;
    var connection = this.connection;
    connection.query(dataSql, returnData);

    //Get CurOwner
    function returnData(err, res, fie) {
        try {
            var curOwner = res[0][cDB_Table_Columns.curOwner.name];
        } catch (e) {
            //Nothing
            //The Item does not exist
        }
        finishCallback(curOwner);
    }
};


_Method.writeNewOwner = function (hashOfProto, newOwner, finishCallback) {
    //Create Sql request
    var dataSql = `SELECT * FROM ${this.table} WHERE ${cDB_Table_Columns.hash.name}="${hashOfProto}" `;
    var updateSql = `UPDATE ${this.table} SET ${cDB_Table_Columns.newOwner.name}="${newOwner}" WHERE ${cDB_Table_Columns.hash.name}="${hashOfProto}"`;

    //Get data
    var connection = this.connection;
    connection.query(dataSql, returnData);

    function returnData(err, res, fie) {
        //Add or Update
        if (res.toString() !== "") {
            connection.query(updateSql, finishCallback);
        } else {
            finishCallback();
        }
    }
};

_Method.writeCurrentOwner = function (hashOfProto, curOwner, finishCallback) {
    //Create Sql request
    var dataSql = `SELECT * FROM ${this.table} WHERE ${cDB_Table_Columns.hash.name}="${hashOfProto}" `;
    var updateSql = `UPDATE ${this.table} SET ${cDB_Table_Columns.curOwner.name}="${curOwner}", ${cDB_Table_Columns.newOwner.name}=NULL WHERE ${cDB_Table_Columns.hash.name}="${hashOfProto}"`;

    //Get data
    var connection = this.connection;
    connection.query(dataSql, returnData);

    function returnData(err, res, fie) {
        //Add or Update
        if (res.toString() !== "") {
            connection.query(updateSql, finishCallback);
        } else {
            finishCallback();
        }
    }
};


_Method.isNewOwnerEmpty = function (hashOfProto, finishCallback) {
    //Request to DB
    var dataSql = `SELECT * FROM ${this.table} WHERE ${cDB_Table_Columns.hash.name}="${hashOfProto}" `;
    var connection = this.connection;
    connection.query(dataSql, returnData);

    //Check for null
    function returnData(err, res, fie) {
        try {
            if (res[0][cDB_Table_Columns.newOwner.name] === null) {
                returnData = true;
            } else {
                returnData = false;
            }
            finishCallback(returnData);
        } catch (e) {
            //Nothing
            //The Item does not exist
            finishCallback(true);
        }
    }

};

_Method.addDICEProto = function (hashOfProto, addr, diceProto, finishCallback) {
    //Create Sql request
    var dataSql = `SELECT * FROM ${this.table} WHERE ${cDB_Table_Columns.hash.name}="${hashOfProto}" `;
    var addNewSql = `INSERT INTO ${this.table} (${cDB_Table_Columns.hash.name},${cDB_Table_Columns.proto.name},${cDB_Table_Columns.curOwner.name}) VALUES ("${hashOfProto}","${diceProto}","${addr}")`;

    //Get data
    this.connection.query(dataSql, returnData);
    var connection = this.connection;
    var instance = this;
    var addrOp = this.addrOp;
    
    //Add or Update
    function returnData(err, res, fie) {
        try {
            if (res.toString() === "") {
                connection.query(addNewSql, finishCallback(true));
            } else {
                finishCallback(false);
            }
        } catch (e) {
            //If there is no record => no table or DB
            instance.createDB(addrOp, () => {
                connection.query(addNewSql, finishCallback(true));
            });
        }
    }
};
module.exports = DBWorker_MySql_Async;