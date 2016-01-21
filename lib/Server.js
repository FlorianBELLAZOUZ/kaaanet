var Wss = require('ws').Server;
var Bin = require('kaaa-bin');
var PacketEmitter = require('./PacketEmitter');

function Server(port, packets){
	this.send = {};
  this._wss = new Wss({port:port});
  this._wss.on('connection', this._onconnection.bind(this));
  PacketEmitter.prototype.constructor.call(this, packets);
}

Server.prototype = Object.create(PacketEmitter.prototype);

Server.prototype.constructor =  Server;

Server.prototype._onconnection = function(socket) {
  var client = new ServerClient(socket, this.packets);
  socket.on('message', this._onmessage.bind(this, client));
  this.emit('connection', client);
}

PacketEmitter.prototype._onmessage = function(client, data) {
  var bin = new Bin();
  bin.decriptUTF8(data);
  var flag = bin.decriptFlag();
  var data = this._decript[flag](bin);
  this.emit(data.name, data, client);
};

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

function ServerClient(ws, packets) {}

ServerClient.prototype.initPackets = function(packets) {}

module.exports = Server;
module.exports._ServerClient = ServerClient;