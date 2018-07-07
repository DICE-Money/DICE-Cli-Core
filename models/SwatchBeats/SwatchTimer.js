/* javascript-obfuscator:disable */
/* 
 * Copyright 2017-2018 Mihail Maldzhanski<pollarize@gmail.com>.
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
/* javascript-obfuscator:enable */

//Referent Time in Switzerland
const _referentDateString = "January 01, 2001 00:00:00 GMT+0100";
const _beatPerSecond = 0.011574;

//Local variables
var _Method = SwatchTimer.prototype;

// Constructor
function SwatchTimer() {
    // always initialize all instance properties
    this._currentDate = new Date();
    this.scheduler = undefined;
    this.beats = undefined;
}

function _CalculateCurrentBeats() {
    var secondsL = 0;
    this._currentDate = new Date();
    this._currentDate.setUTCHours(this._currentDate.getHours());
    secondsL = (this._currentDate.getTime() - new Date(_referentDateString).getTime()) / 1000;
    return secondsL * _beatPerSecond;
}

function _CalculateCurrentDate(beats) {
    return new Date(((beats / _beatPerSecond) * 1000) + new Date(_referentDateString).getTime());
}

//Public methods
_Method.Alive = function () {
    console.log("Hello NodeJS - SwatchTimer");
};

_Method.getReferentDate = function () {
    return _referentDateString;
};

_Method.getBeats = function () {
    return  _CalculateCurrentBeats();
};

_Method.beatsToDate = function (beats) {
    return _CalculateCurrentDate(beats);
};

_Method.getBeatsPer = function (time) {

    var beatsPerL = _beatPerSecond;

    switch (time) {
        case 'minute':
            beatsPerL *= 60;
            break;
        case 'hour':
            beatsPerL *= 60 * 60;
            break;
        case 'day':
            beatsPerL *= 60 * 60 * 24;
            break;
        case 'week':
            beatsPerL *= 60 * 60 * 24 * 7;
            break;
        case 'month31':
            beatsPerL *= 60 * 60 * 24 * 7 * 31;
            break;
        case 'year':
            beatsPerL *= 60 * 60 * 24 * 365;
            break;
        default:
            beatsPerL = _beatPerSecond;
            break;
    }

    return beatsPerL;
};

_Method.BeatsAsync = function (command) {
    switch (command) {
        case 'start':
            //Set present value
            this.beats = _CalculateCurrentBeats();
            
            //Update on 1 second
            this.scheduler = setInterval(() => {
                this.beats = _CalculateCurrentBeats();
            }, 1000);
            break;
        case 'stop':
            clearInterval(this.scheduler);
            break;
        case 'get':
            return this.beats;
            break;
        default:
            //Nothing 
            break;
    }
};

// export the class
module.exports = SwatchTimer;