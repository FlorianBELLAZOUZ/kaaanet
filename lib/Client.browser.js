var Packet = require('./Packet');
var ClientKernel = require('./Client');

function Client(url, packets, opt) {
  this.url = url;
  this._initWs(url, opt);

  ClientKernel.prototype.constructor.call(this, url, packets, opt);
}

Client.prototype = Object.create(ClientKernel.prototype);

Client.prototype.constructor = Client;

Client.prototype._initWs = function(url, opt){
  this._ws = new WebSocket(url, opt);
  this._ws.addEventListener('message', this._onmessage.bind(this));
  this._ws.addEventListener('open', this.emit.bind(this, 'open'));
  this._ws.addEventListener('error', this.emit.bind(this, 'error'));
  this._ws.addEventListener('close', this.emit.bind(this, 'close'));
}

module.exports = Client;
module.exports.Packet = Packet;
