var Expect = require('assert');

var packet = {
	name:"name",
}

// give a data structure that client and serveur will use
function create(packets){
  return packets;
}

var msgNumber = 'the parameter must be a number';
var msgInteger = 'the parameter must be a positif integer';

function Int(bit){
  checkValidity(bit);
  return 'integer-'+bit;
}
function Txt(size) {
  checkValidity(size);
  return 'string-'+size;
}
function ArrayInt(bit, arraySize) {
  checkValidity(bit);
  checkValidity(arraySize);
  return 'arrayNumber-'+bit+'-'+arraySize;
}
function ArrayTxt(size, arraySize){
  checkValidity(size);
  checkValidity(arraySize);
  return 'arrayString-'+size+'-'+arraySize;
}

function checkValidity(bit) {
  Expect.equal(typeof bit, 'number', msgNumber);
  Expect.equal(isPositiveInteger(bit), true, msgInteger)
}

function isPositiveInteger(s) {
    var i = +s; // convert to a number
    if (i < 0) return false; // make sure it's positive
    if (i != ~~i) return false; // make sure there's no decimal part
    return true;
}

module.exports = create;
module.exports.create = create;
module.exports.Int = Int;
module.exports.Txt = Txt;
module.exports.ArrayInt = ArrayInt;
module.exports.ArrayTxt = ArrayTxt;
