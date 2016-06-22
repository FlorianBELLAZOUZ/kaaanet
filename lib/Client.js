var Ws = require('ws');
var Bin = require('kaaabin');
var PacketEmitter = require('./PacketEmitter');
var Packet = require('./Packet');
var Util = require('util');

/**
 * The Client is use to connect to the server
 *
 * @class
 * @param {string} url     the adresse of the server
 * @param {array} packets  the packets to exchange
 * @param {object} opt     the object for the ws client
 */
function Client(url, packets, opt) {
  this.url = url;
  this.opt = opt;

  if( (opt && !opt.asyncConnection)
    || !opt){
    this.connect();
  }

  PacketEmitter.prototype.constructor.call(this, packets);
}

Client.Packet = Packet;

Client.prototype = Object.create(PacketEmitter.prototype);

Client.prototype.constructor = Client;

/**
 * Close the connection to the client
 * @param  {number} code
 * @param  {string} msg
 */
Client.prototype.close = function(code, msg) {
  this._ws.close(code, msg);
};

Client.prototype._initWs = function(url, opt) {
  this.url = url || this.url;
  this.opt = typeof window !== 'undefined' ? null : (opt || this.opt); // fix browser

  this._ws = new Ws(this.url, this.opt);
  this._ws.on('message', this._onmessage.bind(this));
  this._ws.on('open', this.emit.bind(this, 'open'));
  this._ws.on('error', this.emit.bind(this, 'error'));
  this._ws.on('close', this.emit.bind(this, 'close'));
}

Client.prototype.connect = Client.prototype._initWs;

/**
 * Reconnection to the server
 * @param  {string} url addresse to the server
 * @param  {object} opt options for the ws client
 */
Client.prototype.reconnection = function(url, opt) {
  this._ws.close();
  this._initWs(url, opt);
}

Client.prototype._onmessage = function(data) {
  if(data.data) data = data.data; // Fix for WebSocket browser

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
