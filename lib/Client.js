var Ws = require('ws');
var Bin = require('kaaa-bin');
var PacketEmitter = require('./PacketEmitter');

function Client(url, packets){
  this._ws = new Ws(url);
  this._ws.on('message', this._onmessage.bind(this));
  this._ws.on('open', this.emit.bind(this, 'open'));
  this._ws.on('error', this.emit.bind(this, 'error'));
  this._ws.on('close', this.emit.bind(this, 'close'));

  PacketEmitter.prototype.constructor.call(this, packets);
}

Client.prototype = Object.create(PacketEmitter.prototype);

Client.prototype.constructor = Client;

Client.prototype.close = function(code, msg){
  this._ws.close(code, msg);
}

Client.prototype._onmessage = function(data) {
  var bin = new Bin();
  bin.decriptUTF8(data);
  var flag = bin.decriptFlag();
  var data = this._decript[flag](bin);
  this.emit(data.name, data, this);
}

Client.prototype._createSend = function(packet) {
  var _this = this;
  return function(data) {
    var p = _this._cript[packet.name](data);
    _this._ws.send(p);
  }
}


module.exports = Client;