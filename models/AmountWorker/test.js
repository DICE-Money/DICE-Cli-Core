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
                        {name: "Tst_1/1024_1_NEW", owner: "f87b0-31850-b97f9-835c9-9cb13-f91ce-43832-8537c", value: 1 / 1024},
                        {name: "Tst_2/1024_NEW", owner: "f87b0-31850-b97f9-835c9-9cb13-f91ce-43832-8537c", value: 2 / 1024},
                        {name: "Tst_8/1024_NEW", owner: "f87b0-31850-b97f9-835c9-9cb13-f91ce-43832-8537c", value: 8 / 1024},
                        {name: "Tst_32/1024_NEW", owner: "f87b0-31850-b97f9-835c9-9cb13-f91ce-43832-8537c", value: 32 / 1024},
                        {name: "Tst_16/1024_NEW", owner: "f87b0-31850-b97f9-835c9-9cb13-f91ce-43832-8537c", value: 16 / 1024},
                        {name: "Tst_1/1024_2_NEW", owner: "f87b0-31850-b97f9-835c9-9cb13-f91ce-43832-8537c", value: 1 / 1024},
                        {name: "Tst_512/1024_NEW", owner: "f87b0-31850-b97f9-835c9-9cb13-f91ce-43832-8537c", value: 512 / 1024},
                        {name: "Tst_2048/1024_NEW", owner: "f87b0-31850-b97f9-835c9-9cb13-f91ce-43832-8537c", value: 2048 / 1024},
                        {name: "Tst_1/1024_1", owner: "f87b0-31850-b97f9-835c9-9cb13-f91ce-43832-8537c", value: 1 / 1024},
                        {name: "Tst_2/1024", owner: "f87b0-31850-b97f9-835c9-9cb13-f91ce-43832-8537c", value: 2 / 1024},
                        {name: "Tst_8/1024", owner: "f87b0-31850-b97f9-835c9-9cb13-f91ce-43832-8537c", value: 8 / 1024},
                        {name: "Tst_32/1024", owner: "f87b0-31850-b97f9-835c9-9cb13-f91ce-43832-8537c", value: 32 / 1024},
                        {name: "Tst_16/1024", owner: "f87b0-31850-b97f9-835c9-9cb13-f91ce-43832-8537c", value: 16 / 1024},
                        {name: "Tst_1/1024_2", owner: "f87b0-31850-b97f9-835c9-9cb13-f91ce-43832-8537c", value: 1 / 1024},
                        {name: "Tst_512/1024", owner: "f87b0-31850-b97f9-835c9-9cb13-f91ce-43832-8537c", value: 512 / 1024},
                        {name: "Tst_2048/1024", owner: "f87b0-31850-b97f9-835c9-9cb13-f91ce-43832-8537c", value: 2048 / 1024},
                        {name: "Tst_128/1024", owner: "f87b0-31850-b97f9-835c9-9cb13-f91ce-43832-8537c", value: 128 / 1024},
                        {name: "Tst_1024/1024", owner: "f87b0-31850-b97f9-835c9-9cb13-f91ce-43832-8537c", value: 1024 / 1024}
                    ];

            var result = nstAmount.encodeAmount(units, target);
            var sum = result.amount * 1024;

            //Console
            console.log('Amount collected', sum);
            console.log(result.units);

            //Add return data from execution
            addContext(this, {title: 'Amount collected', value: sum});
            addContext(this, {title: 'Names of units', value: result.units});

            if (sum < target) {
                throw new Error("Invalid amount");
            }
        });

    });

    var globalUnitsSmall =
            [
                {name: "Tst_1/1024_1_NEW", owner: "f87b0-31850-b97f9-835c9-9cb13-f91ce-43832-8537c", value: 1 / 1024},
                {name: "Tst_2/1024_NEW", owner: "f87b0-31850-b97f9-835c9-9cb13-f91ce-43832-8537c", value: 2 / 1024},
                {name: "Tst_1/1024_2_NEW", owner: "f87b0-31850-b97f9-835c9-9cb13-f91ce-43832-8537c", value: 1 / 1024},
                {name: "Tst_4/1024_NEW", owner: "f87b0-31850-b97f9-835c9-9cb13-f91ce-43832-8537c", value: 4 / 1024},
                {name: "Tst_8/1024_NEW", owner: "f87b0-31850-b97f9-835c9-9cb13-f91ce-43832-8537c", value: 8 / 1024}
            ];

    it(`Execute OWNERLESS encoding of units amount 1 mDICE FIRST time`, function () {
        executeSameAmountAndReduce(globalUnitsSmall, 1, this, 1);
    });

    it(`Execute OWNERLESS encoding of units amount 1 mDICE SECOND time`, function () {
        executeSameAmountAndReduce(globalUnitsSmall, 1, this, 1);
    });

    it(`Execute OWNERLESS encoding of units amount 1 mDICE THIRD time`, function () {
        executeSameAmountAndReduce(globalUnitsSmall, 1, this, 2);
    });

    var globalUnits =
            [
                {name: "Tst_1/1024_1_NEW", owner: "f87b0-31850-b97f9-835c9-9cb13-f91ce-43832-8537c", value: 1 / 1024},
                {name: "Tst_2/1024_NEW", owner: "f87b0-31850-b97f9-835c9-9cb13-f91ce-43832-8537c", value: 2 / 1024},
                {name: "Tst_1/1024_2_NEW", owner: "f87b0-31850-b97f9-835c9-9cb13-f91ce-43832-8537c", value: 1 / 1024},
                {name: "Tst_4/1024_NEW", owner: "f87b0-31850-b97f9-835c9-9cb13-f91ce-43832-8537c", value: 4 / 1024}
            ];


    it(`Execute OWNERLESS encoding of units amount 3 mDICE FIRST time`, function () {
        executeSameAmountAndReduce(globalUnits, 3, this);
    });

    it(`Execute OWNERLESS encoding of units amount 3 mDICE SECOND time`, function () {
        executeSameAmountAndReduce(globalUnits, 3, this);
    });

    it(`Execute OWNERLESS encoding of units amount 3 mDICE THIRD time`, function () {
        executeSameAmountAndReduce(globalUnits, 3, this, 0);
    });

    it(`Execute OWNERLESS encoding of units amount 1 mDICE at last`, function () {
        executeSameAmountAndReduce(globalUnits, 1, this, 1);
    });

    function executeSameAmountAndReduce(units, amount, mochaContext, specialExpectation) {

        var result = nstAmount.encodeAmount(units, amount);
        var sum = result.amount * 1024;

        addContext(mochaContext, {title: 'Names of units in local bank (Before)', value: units});
        console.log('Global units Before', units);

        for (var unitName of result.units) {
            for (var unit of units) {
                if (unitName === unit.name) {
                    unit.owner = "";
                }
            }
        }

        //Console
        console.log('Global units After', units);
        console.log('Amount collected', sum);
        console.log('Returned array', result.units);

        if (specialExpectation !== undefined) {
            addContext(mochaContext, {title: `Special expectation of amount ${specialExpectation}`});
        }

        //Add return data from execution
        addContext(mochaContext, {title: 'Names of units in local bank (After)', value: units});
        addContext(mochaContext, {title: 'Amount collected', value: sum});
        addContext(mochaContext, {title: 'Names of units', value: result.units});


        if (sum < amount) {
            if (specialExpectation === undefined || sum !== specialExpectation) {
                throw new Error("Invalid amount");
            }
        }

        if (specialExpectation !== undefined && sum !== specialExpectation) {
            throw new Error("Invalid special expectation");
        }
    }
});
