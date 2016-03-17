var Ws = typeof window === 'undefined' ? require('ws') : null
var Bin = require('kaaa-bin');
var PacketEmitter = require('./PacketEmitter');
var Util = require('util');

function Client(url, packets, opt) {
  this.url = url;
  this._initWs(url, opt);

  PacketEmitter.prototype.constructor.call(this, packets);
}

Client.prototype = Object.create(PacketEmitter.prototype);

Client.prototype.constructor = Client;

Client.prototype.close = function(code, msg) {
  this._ws.close(code, msg);
};

Client.prototype.reconnection = function(url, opt) {
  this._initWs(url, opt);
}

Client.prototype._initWs = function(url, opt){
  this._ws = new Ws(url, opt);
  this._ws.on('message', this._onmessage.bind(this));
  this._ws.on('open', this.emit.bind(this, 'open'));
  this._ws.on('error', this.emit.bind(this, 'error'));
  this._ws.on('close', this.emit.bind(this, 'close'));
}

Client.prototype._onmessage = function(data) {
  var bin = new Bin();
  bin.decriptUTF8(data);
  var flag = bin.decriptFlag();
  if (this._decript[flag] === undefined) {
    var msg = '[kaaanetClient] on message from ' + this.url;
    msg += ' The flag n° ' + flag + ' don\'t exist in the client\'s packets ';
    msg += '' + Util.inspect(this.packets);
    throw new Error(msg);
  }

  var data = this._decript[flag](bin);
  this.emit(data.name, data, this);
};

Client.prototype._createSend = function(packet) {
  var _this = this;
  return function(data) {
    var p = _this._cript[packet.name](data);
    if (_this._ws.readyState === 1) _this._ws.send(p);
  };
};

module.exports = Client;
