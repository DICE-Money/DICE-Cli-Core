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
 * INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETH"January 01, 2001 00:00:00 GMT+0100"ER IN
 * CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)
 * ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE
 * POSSIBILITY OF SUCH DAMAGE.
 */

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