var Expect = require('assert');

/**
 * @namespace Packet
 */

var packet = {
	name:"name",
}

/**
 * Create a template for the packets
 * @param  {array} packets   the packets descriptions
 * @return {Packets}         the packets template
 * @memberof Packet
 */
function create(packets){
  return packets;
}

var msgNumber = 'the parameter must be a number';
var msgInteger = 'the parameter must be a positif integer';

/**
 * Create a integer in the packet template
 * @param {integer} bits number of bits to code the future integer
 * @memberof Packet
 * @example
 * var Packet = require('kaaanet').Packet
 * var packet = Packet.create([
 *   {
 *     name:'player',
 *     x:Int(10), // the template code a x property on 10 bits so the value can be between 0 to 1024 (2^10)
 *     y:Int(12)  // the template code a y property on 12 bits so the value can be between 0 to 4096 (2^12)
 *   }
 * ]);
 *
 * var Client = require('kaaanet').Client
 * var client = new Client('ws://localhost:8008', packet);
 * client.send.player({x:1002, y:4032})
 */
function Int(bits){
  checkValidity(bits);
  return ['i',bits];
}

/**
 * Create a string in the packet template
 * @param {integer} size the number of char that can be use in the property
 * @memberof Packet
 * @example
 * var Packet = require('kaaanet').Packet
 * var packet = Packet.create([
 *   {
 *     name:'message',
 *     title:Txt(20), // the template code a title property on 20 chars so the string can have a length of 0 to 20
 *     text:Txt(128)  // the template code a text property on 128 chars so the string can have a length of 0 to 128
 *   }
 * ]);
 *
 * var Client = require('kaaanet').Client
 * var client = new Client('ws://localhost:8008', packet);
 * client.send.message({title:'Error', text:'You have not enougth gold'})
 */
function Txt(size) {
  checkValidity(size);
  return ['t', size];
}

/**
 * Create an array of integer
 * @param {integer} bits      number of bits to code the future array integer elements
 * @param {integer} arraySize number of elements that can be contain in the array int
 * @memberOf Packet
 */
function ArrayInt(bits, arraySize) {
  checkValidity(bits);
  checkValidity(arraySize);
  return ['I', bits, arraySize];
}

/**
 * Create an array of string
 * @param {integer} bits      number of bits to code the future array string elements
 * @param {integer} arraySize number of elements that can be contain in the array int
 * @memberOf Packet
 */
function ArrayTxt(size, arraySize){
  checkValidity(size);
  checkValidity(arraySize);
  return ['T', size, arraySize];
}

function checkValidity(bits) {
  Expect.equal(typeof bits, 'number', msgNumber);
  Expect.equal(isPositiveInteger(bits), true, msgInteger)
}

function isPositiveInteger(s) {
    var i = +s; // convert to a number
    if (i < 0) return false; // make sure it's positive
    if (i != ~~i) return false; // make sure there's no decimal part
    return true;
}

/** create */
module.exports = create;
module.exports.create = create;
module.exports.Int = Int;
module.exports.Txt = Txt;
module.exports.ArrayInt = ArrayInt;
module.exports.ArrayTxt = ArrayTxt;
