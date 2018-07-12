/* 
 * Copyright 2018 Mihail Maldzhanski<pollarize@gmail.com>.
 * DICE Money Ltd.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

//Requires
const assert = require('assert');
const addContext = require('mochawesome/addContext');
const modAmountWorker = require('./AmountWorker.js');

//Default timer for executions of test is 2 minutes
const maxTimeOut = 2 * 60 * 1000;

describe("Test Amount worker", function () {

    var nstAmount = {};
    var arAmountCases =
            [
                10,
                11,
                40,
                41,
                45,
                513,
                75,
                120,
                121,
                127,
                129,
                1546,
                5096
            ];


    it("Create instance of model", function () {
        nstAmount = new modAmountWorker();
    });


    arAmountCases.forEach((target) => {
        it(`Execute encoding of units amount ${target}`, function () {
            var units =
                    [
                        {name: "Tst_1/1024_1_NEW", value: 1 / 1024},
                        {name: "Tst_2/1024_NEW", value: 2 / 1024},
                        {name: "Tst_8/1024_NEW", value: 8 / 1024},
                        {name: "Tst_32/1024_NEW", value: 32 / 1024},
                        {name: "Tst_16/1024_NEW", value: 16 / 1024},
                        {name: "Tst_1/1024_2_NEW", value: 1 / 1024},
                        {name: "Tst_512/1024_NEW", value: 512 / 1024},
                        {name: "Tst_2048/1024_NEW", value: 2048 / 1024},
                        {name: "Tst_1/1024_1", value: 1 / 1024},
                        {name: "Tst_2/1024", value: 2 / 1024},
                        {name: "Tst_8/1024", value: 8 / 1024},
                        {name: "Tst_32/1024", value: 32 / 1024},
                        {name: "Tst_16/1024", value: 16 / 1024},
                        {name: "Tst_1/1024_2", value: 1 / 1024},
                        {name: "Tst_512/1024", value: 512 / 1024},
                        {name: "Tst_2048/1024", value: 2048 / 1024},
                        {name: "Tst_128/1024", value: 128 / 1024},
                        {name: "Tst_1024/1024", value: 1024 / 1024},
                    ];

            var result = nstAmount.encodeAmount(units, target);
            var sum = 0;

            result.forEach((res) => {
                units.forEach((unit) => {
                    if (unit.name === res)
                        sum += unit.value;
                });
            });

            sum = sum * 1024;

            //Cconsole
            console.log('Amount collected', sum);
            console.log(result);

            //Add return data from execution
            addContext(this, {title: 'Amount collected', value: sum});
            addContext(this, {title: 'Names of units', value: result});
            
            if (sum < target) {
                throw new Error("Invalid sum");
            }
        });

    });
});