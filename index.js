var Packet = exports.Packet = require('./lib/Packet');
exports.Client = require('./lib/Client');
exports.Server = require('./lib/Server');
exports.addPackets = require('./lib/Server')._addPacket;
exports.ArrayInt = Packet.ArrayInt;
exports.ArrayTxt = Packet.ArrayTxt;
exports.Int = Packet.Int;
exports.Txt = Packet.Txt;
