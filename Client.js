var Ws = require('ws');
var Bin = require('kaaa-bin');
var PacketEmitter = require('./PacketEmitter');

function Client(url, packets){
	this.send = {};
  this._ws = new Ws(url);
  this._ws.on('message', this._onmessage.bind(this));
  this._ws.on('open', this.emit.bind(this, 'open'));
  PacketEmitter.prototype.constructor.call(this, packets);
}

Client.prototype = Object.create(PacketEmitter.prototype);

Client.prototype.constructor = Client;

Client.prototype._onmessage = function(data) {
  var bin = new Bin();
  bin.decriptUTF8(data);
  var flag = bin.decriptFlag();
  var data = this._decript[flag](bin);
  this.emit(data.name, data);
}

Client.prototype._createSend = function(packet) {
  var _this = this;
  return function(data) {
    var p = _this._cript[packet.name](data);
    _this._ws.send(p);
  }
}


module.exports = Client;