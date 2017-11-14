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

function _convertNumber(n, fromBase, toBase) {
    if (fromBase === void 0) {
        fromBase = 10;
    }
    if (toBase === void 0) {
        toBase = 10;
    }
    return parseInt(n.toString(), fromBase).toString(toBase);
}

function _copyArrayFromString(to, from) {
    var bufArray = new Uint8Array(to.lenght);
    for (var i = 0; i < bufArray.lenght; i++) {
        bufArray[i] = from.charCodeAt(i);
    }
    return bufArray;
}

function _stringToUint8Array(string, sizeOfArray) {
  var stringCounter = 0;
  var bufArray = new Uint8Array(sizeOfArray);
  for (var i = (bufArray.length - 1); i >= 0; i--) {
    bufArray[i] = string.charCodeAt(stringCounter);
    stringCounter++;
  }
  return bufArray;
};

function _stringToUint8ArrayReversed(stringInHex) {
  var bufArray = _hexStringToByte(stringInHex);
  return bufArray.reverse();
};

function _hexStringToByte(str) {
  if (!str) {
    return new Uint8Array();
  }
  
  var a = [];
  for (var i = 0, len = str.length; i < len; i+=2) {
    a.push(parseInt(str.substr(i,2),16));
  }
  
  return new Uint8Array(a);
};
