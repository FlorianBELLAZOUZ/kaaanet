var Wss = require('ws').Server;
var Bin = require('kaaa-bin');
var PacketEmitter = require('./PacketEmitter');

function Server(port, packets){
  this.packets = packets;
  this._wss = new Wss({
    port:port,
    verifyClient:this._onhandshake.bind(this)
  }, this.emit.bind(this, 'open'));
  this._wss.on('connection', this._onconnection.bind(this));
  this._wss.on('error', this.emit.bind(this, 'error'));
  PacketEmitter.prototype.constructor.call(this, packets);
}

Server.prototype = Object.create(PacketEmitter.prototype);

Server.prototype.initPackets = function(packets) {
  this.packets = packets;
  PacketEmitter.prototype.initPackets.call(this, packets);
}

Server.prototype.constructor =  Server;

Server.prototype._onconnection = function(socket) {
  var client = new ServerClient(socket, this.packets);
  socket.on('message', this._onmessage.bind(this, client));
  this.emit('connection', client);
}

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
}

Server.prototype._createSend = function(packet) {
  var _this = this;
  return function(data) {
    var p = _this._cript[packet.name](data);
    _this._sendToAllClients(p);
  }
}

Server.prototype._sendToAllClients = function(data) {
  for (var i = this._wss.clients.length - 1; i >= 0; i--) {
    this._wss.clients[i].send(data);
  };
}

/////////////////////////////////

function ServerClient(ws, packets) {
  this._ws = ws;
  this._ws.on('message', this._onmessage.bind(this));
  this._ws.on('error', this.emit.bind(this, 'error'))
  this._ws.on('close', this.emit.bind(this, 'close'))
  PacketEmitter.prototype.constructor.call(this, packets);
}

ServerClient.prototype = Object.create(PacketEmitter.prototype);

ServerClient.prototype.constructor =  ServerClient;

ServerClient.prototype._onmessage = function(data) {
  var bin = new Bin();
  bin.decriptUTF8(data);
  var flag = bin.decriptFlag();
  var data = this._decript[flag](bin);
  this.emit(data.name, data, this);
}

ServerClient.prototype._createSend = function(packet) {
  var _this = this;
  return function(data) {
    var p = _this._cript[packet.name](data);
    _this._ws.send(p);
  }
}

module.exports = Server;
module.exports._ServerClient = ServerClient;