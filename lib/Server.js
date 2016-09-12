var _ = require('lodash');
var PacketEmitter = require('./PacketEmitter');
var Wss = require('ws').Server;
var Bin = require('kaaabin');
var Util = require('util');
var Http = require('http').Server;
var Https = require('https').Server;

/**
 * The Server is use to open a port and wainting for client connection
 *
 * @class
 * @param {numberOrHttpServ} portOrHttpServ  the adresse of the server
 * @param {array} packets  the packets template to exchange data
 *
 * @fires connection
 */
function Server(portOrHttpServ, packets) {
  var options = {
    verifyClient:this._onhandshake.bind(this),
  };

  if (!isNaN(Number(portOrHttpServ))) {
    options.port = portOrHttpServ;
  } else
  if (portOrHttpServ instanceof Http
    || portOrHttpServ instanceof Https) {
    options.server = portOrHttpServ;
  }

  this._wss = new Wss(options, this.emit.bind(this, 'open'));
  this._wss.on('connection', this._onconnection.bind(this));
  this._wss.on('error', this.emit.bind(this, 'error'));
  this.clients = [];
  PacketEmitter.prototype.constructor.call(this, packets);
}

/**
 * Fire when a client connect to the server
 * @event Server#connection
 * @type {object}
 * @property {Client} client the connected client
 */

/**
 * Fire when a error throw in the server
 * @event Server#error
 * @type {object}
 */

Server.prototype = Object.create(PacketEmitter.prototype);

Server.prototype.constructor =  Server;

/**
 * Close server
 */
Server.prototype.close = function() {
  this._wss.close();
};

Server.prototype._onconnection = function(socket) {
  var _this = this;
  var client = new ServerClient(socket, this.packets);
  client.on('message', this._onmessage.bind(this, client));
  client.on('close', function() {
    var index = _this.clients.indexOf(client);
    if (index != -1) _this.clients.splice(index, 1);
  });

  this.clients.push(client);
  this.emit('connection', client);
};

Server.prototype._onmessage = function(client, data) {
  var bin = new Bin();
  bin.decriptUTF8(data);
  var flag = bin.decriptFlag();
  var data = this._decript[flag](bin);
  this.emit(data.name, data, client);
};

Server.prototype._onhandshake = function(info, cb) {
  if (this.onhandshake) {
    this.onhandshake.call(this, info, cb);
  }else {
    cb(true);
  }
};

Server.prototype._createSend = function(packet) {
  var _this = this;
  return function(data) {
    var p = _this._cript[packet.name](data);
    _this._sendToAllClients(p);
  };
};

Server.prototype._sendToAllClients = function(data) {
  for (var i = this._wss.clients.length - 1; i >= 0; i--) {
    var c = this._wss.clients[i];
    if (c.readyState === 1) c.send(data);
  };
};

/////////////////////////////////

function ServerClient(ws, packets) {
  PacketEmitter.prototype.constructor.call(this, packets);
  this._ws = ws;
  this._ws.on('message', this._onmessage.bind(this));
  this._ws.on('message', this.emit.bind(this, 'message'));
  this._ws.on('error', this.emit.bind(this, 'error'));
  this._ws.on('close', this.emit.bind(this, 'close'));
}

ServerClient.prototype = Object.create(PacketEmitter.prototype);

ServerClient.prototype.constructor =  ServerClient;

ServerClient.prototype.close = function() {
  this._ws.close();
};

ServerClient.prototype._onmessage = function(data) {
  if(typeof window === 'object') data = data.data
  var bin = new Bin();
  bin.decriptUTF8(data);
  var flag = bin.decriptFlag();

  if (this._decript[flag] === undefined) return

  var data = this._decript[flag](bin);
  this.emit(data.name, data, this);
};

ServerClient.prototype._createSend = function(packet) {
  var _this = this;
  return function(data) {
    var p = _this._cript[packet.name](data);
    if (_this._ws.readyState === 1) _this._ws.send(p);
  };
};

module.exports = Server;
module.exports._ServerClient = ServerClient;
module.exports._addPacket = (ws, packets)=>new ServerClient(ws, packets)
