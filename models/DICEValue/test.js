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

const modFs = require('fs');
const modDICEValue = require('./DICEValue.js');
const modDICEUnit = require('../DICECalculator/DICEUnit.js');
const modDICECalculator = require('../DICECalculator/DICECalculator.js');

//1. Create an empty DICE unit
var DICE = new modDICEUnit();
var DICECalc = new modDICECalculator();

//2. Read data for Valid DICE Unit from file
file = modFs.readFileSync('../../diceUnit.json', "utf8");
DICE = DICE.from(file);

//3. Create a new instance of the Value 
//and save the current DICE to It
var value = new modDICEValue();
value.setDICEProtoFromUnit(DICE);

//4. Print How Many zeroes have been founded in HEX 
console.log(value.getZeroes());

//5. Print HEX to BIN of hash
console.log(DICECalc.getSHA3OfUnit(DICE));

//6. Print Value of the DICE Unit
value.calculateValue(1, 20, 44);
console.log(value.unitValue);