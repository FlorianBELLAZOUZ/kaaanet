var Bin = require('kaaabin')
var EventEmitter = require('events');
var _ = require('lodash');

function PacketEmitter(packets) {
  this.packets = packets;
  this.send = {};
  this._cript = {};
  this._decript = {};
  if (packets) this.initPackets(packets);
}

PacketEmitter.prototype = Object.create(EventEmitter.prototype);

PacketEmitter.prototype.constructor = PacketEmitter;

PacketEmitter.prototype.initPackets = function(packets) {
  this.packets = packets;
  this._createCripts(packets);
  this._createDecripts(packets);
  this._createSends(packets);
};

PacketEmitter.prototype.extendPackets = function(packets) {
  this.packets = this.packets.concat(packets);
  this.initPackets(this.packets);
};

PacketEmitter.prototype._createCripts = function(packets) {
  for (var i = packets.length - 1; i >= 0; i--) {
    var p = packets[i];
    this._cript[p.name] = this._createCript(p, i);
  };
};

PacketEmitter.prototype._createDecripts = function(packets) {
  for (var i = packets.length - 1; i >= 0; i--) {
    var p = packets[i];
    this._decript[i] = this._createDecript(p);
  };
};

PacketEmitter.prototype._createSends = function(packets) {
  for (var i = packets.length - 1; i >= 0; i--) {
    var p = packets[i];
    this.send[p.name] = this._createSend(p);
  };
};

PacketEmitter.prototype._createSend = function() {};

PacketEmitter.prototype._createDecript = function(packet) {
  var _this = this;
  return function(bin) {
    var out = {};
    out.name = packet.name;

    _this._decriptBinaryWithPacket(packet, bin, out);

    return out;
  };
};

PacketEmitter.prototype._decriptBinaryWithPacket = function(packet, bin, out) {
  var make = {
    t: 'decriptString',
    i: 'decript',
    T: 'decriptArrayString',
    I: 'decriptArray',
  };

  if (bin.bin === '') return;

  for (var i in packet) {
    if (i === 'name') continue;

    if (typeof packet[i][0] === 'object') {
      if (typeof packet[i][1] != 'number') {
        var msg = 'the collection packet definition : "' + i + '"\n';
        msg += 'must have an integer in the second element to define the size of the collection (in bits)\n';
        msg += ' Actual value : ' + packet[i][1];
        throw new SyntaxError(msg);
      }

      var le = bin.decript(packet[i][1]);
      var collection = [];
      for (var y = 0; y < le; y++) {
        var obj = {};
        this._decriptBinaryWithPacket(packet[i][0], bin, obj);
        collection.unshift(obj);
      }

      out[i] = collection;
    }else {
      var type =  packet[i][0];
      var size =  packet[i][1];


      var algo = make[type];
      if (algo === undefined) throw new TypeError('The type ' + type + ' don\'t exist');

      if(type === 'T' || type === 'I') {
        out[i] = bin[algo].call(bin, size, packet[i][2]);
      }else {
        out[i] = bin[algo].call(bin, size);
      }
    }
  }
};

PacketEmitter.prototype._createCript = function(packet, flag) {
  var _this = this;
  return function(data) {
    var bin = new Bin();
    bin.criptFlag(flag);
    _this._createBinaryWithPacket(packet, bin, data);
    return bin.criptUTF8();
  };
};

PacketEmitter.prototype._createBinaryWithPacket = function(packet, bin, data) {
  var make = {
    t: 'criptString',
    i: 'cript',
    T: 'criptArrayString',
    I: 'criptArray',
  };

  var _undefined = {
    t: '',
    i: 0,
    T: [],
    I: [],
  };

  if(!data) return;

  for (var i in packet) {
    if (i === 'name') continue;

    var type =  packet[i][0];
    var size =  packet[i][1];

    if (typeof packet[i][0] === 'object') {
      if(!data[i]) {
        bin.cript(packet[i][1], 0);
        continue;
      }

      bin.cript(packet[i][1], data[i].length);
      var collectionData = data[i];
      for (var y = collectionData.length - 1; y >= 0; y--) {
        var _data = collectionData[y];
        this._createBinaryWithPacket(packet[i][0], bin, _data);
      };
    }else {
      var algo = make[type];

      data[i] = data[i] === undefined ? _undefined[type] : data[i];

      if(type === 'T' || type === 'I') {
        bin[algo].call(bin, size, packet[i][2], data[i]);
      }else {
        bin[algo].call(bin, size, data[i]);
      }
    }
  }
};

module.exports = PacketEmitter;
