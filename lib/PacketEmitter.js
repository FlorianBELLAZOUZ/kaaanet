var EventEmitter = require('events');

function PacketEmitter(packets) {
  this.send = {};
  this._cript = {};
  this._decript = {};
  if(packets) this.initPackets(packets);
}

PacketEmitter.prototype = Object.create(EventEmitter.prototype);

PacketEmitter.prototype.constructor = PacketEmitter;

PacketEmitter.prototype.initPackets = function(packets){
  this._createCripts(packets);
  this._createDecripts(packets);
  this._createSends(packets);
}

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
}

PacketEmitter.prototype._createSend = function(){}

PacketEmitter.prototype._createDecript = function(packet) {
  return function(bin) {
    var make = {
      'string' : 'decriptString',
      'integer' : 'decript',
      'arrayString' : 'decriptArrayString',
      'arrayNumber' : 'decriptArray',
    }
    var out = {};
    out.name = packet.name;

    for (var i in packet) {
      if(i === 'name') continue;
      var split = packet[i].split('-');
      var type =  split[0];
      var size =  split.slice(1).map(function(el) {return Number(el)});

      out[i] = bin[make[type]].apply(bin,size.concat(i));
    }

    return out;
  }
}

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
    'string' : 'criptString',
    'integer' : 'cript',
    'arrayString' : 'criptArrayString',
    'arrayNumber' : 'criptArray',
  }

  for (var i in packet) {
    if(i === 'name' || !data || !data[i]) continue;
    var split = packet[i].split('-');
    var type =  split[0];
    var size =  split.slice(1).map(function(el) {return Number(el)});

    bin[make[type]].apply(bin, size.concat([data[i]]));
  }
};

module.exports = PacketEmitter;