var _ = require('lodash');
var Ws = require('ws');
var Mocha = require('mocha');
var Wss = require('ws').Server;
var Events = require('events');
var Should = require('chai').should();
var Packet = require('../index.js').Packet;
var Server = require('../index.js').Server;
var Client = require('../index.js').Client;
var ServerClient = require('../index.js').Server._ServerClient;

var server;
var packet;
var client;
var ws;
var wss;

var array = [
  {
    name:'test',
    version:'integer-2'
 }
]

describe('Packet', function() {
  describe('#create', function () {
    it('should create an object', function() {
      packet = Packet.create(array);
      packet.should.be.an.instanceof(Object);
    });
  });
});

describe('Server', function() {
  server = new Server(8080);

  it('should be an instanceof events', function() {
    server.should.be.an.instanceof(Events);
  })

  it('should got an instanceof websocketserver', function() {
    server._wss.should.be.an.instanceof(Wss);
  });

  it('should open an websocket server', function(done) {
    ws = new Ws('ws://localhost:8080');
    ws.on('open', done);
  });

  describe('#initPackets', function() {
    before(function(){
      server.initPackets(packet);
    });

    it('should create send function with packet', function() {
      for (var i = 0, le = array.length; i < le; i++) {
        var name = array[i].name;
        server.send[name].should.exist;
        server.send[name].should.be.a.instanceof(Function);
      }
    });
  });

  describe('#send', function() {
    it('should send packet to all connected client', function(done) {
      var cb = 0;
      for (var i = 0, le = array.length; i < le; i++) {
        var name = array[i].name;
        server.send[name]();
      }
      ws.on('message', function() {
        if (++cb === _.size(server.send)) done();
      });
    });
  })

  describe('!connection', function() {
    it('should get an instanceof ServerClient on first argument', function(done) {
      server.once('connection', function(client) {
        client.should.be.an.instanceof(ServerClient);
        ws.close();
        done();
      });

      var ws = new Ws('ws://localhost:8080');
    });
  });

  describe('!packetName', function() {
    var args;
    before(function (done) {
      server.on('test', function(data, client) {
        args = arguments;
        ws.close();
        done();
      });

      var ws = new Ws('ws://localhost:8080');
      ws.on('open', function() {
        var packet = new Bin();
        packet.criptFlag(0);
        packet.cript(2,2);
        packet.criptUTF8();
        ws.send(packet.utf8);
      });
    });

    it('should get data on first argument', function() {
      var data = args[0];
      data.should.exist;
      data.should.have.property('version');
      data.version.should.be.equal(2);
    });

    it('should get client on second argument', function() {
      var client = args[1];
      client.should.exist;
      client.should.be.a.instanceof(ServerClient);
    });
  });
});

describe('Client', function() {
  var wss = new Wss({port:8888});
  wss.on('connection', function(socket) {
    socket.on('message', function(data){
      this._onmessage(socket, data)
    }.bind(this));
  });
  wss._onmessage = function(){};

  before(function() {
    client = new Client('ws://localhost:8888');
  });

  it('should have an instanceof websocket', function() {
    client._ws.should.be.an.instanceof(Ws);
  });

  describe('#initPackets', function() {
    before(function() {
      client.initPackets(packet);
    });

    it('should create send function', function(){
      for (var i = 0, le = array.length; i < le; i++) {
        var name = array[i].name;
        client.send[name].should.exist;
        client.send[name].should.be.a.instanceof(Function);
      }
    });
  });

  describe('#send', function() {
    it('should send packet to server', function(done) {
      var cb = 0;
      wss._onmessage = function(socket, data) {
        if (++cb === _.size(client.send)) done();
      };

      for (var i = 0, le = array.length; i < le; i++) {
        var name = array[i].name;
        client.send[name]();
      }
    });
  });

  describe('!open', function () {
    it('should fire open when the client is connected', function(done) {
      var client = new Client('ws://localhost:8888');
      client.on('open', done);
    });
  });

  describe('!packetName', function() {
    var args;
    before(function (done) {
      var packet = new Bin();
      packet.criptFlag(0);
      packet.cript(2,2);
      packet.criptUTF8();
      wss.clients[0].send(packet.utf8);

      client.on('test', function(data, client) {
        args = arguments;
        ws.close();
        done();
      });
    });

    it('should get data on first argument', function() {
      var data = args[0];
      data.should.exist;
      data.should.have.property('version');
      data.version.should.be.equal(2);
    });
  });
});


describe('E2E test', function() {
  context('should exchange all packets', function() {
    var packet;
    var server;
    var client;

    before(function(done) {
      packet = new Packet([
        {
          name:'test',
          version:'integer-2',
          string:'string-4',
          arrayString:'arrayString-4-4',
          arrayNumber:'arrayNumber-6-4',
        },
        {
          name:'testFoo',
          number:'integer-30',
        },
        {
          name:'gamePacket',
          x:'integer-11',
          y:'integer-11',
          state:'integer-4',
          entity:'integer-4',
        },
      ]);

      server = new Server(8889, packet);
      client = new Client('ws://localhost:8889', packet);
      client.on('open', done);
    });

    testPackets = {
      test : {
        version : 3,
        string : 'OK',
        arrayString : [
          'foo',
          'nice',
          'wow',
          'haha'
        ],
        arrayNumber : [
          10,
          12,
          23,
          4
        ]
      },

      testFoo : {
        number : 3,
      },

      gamePacket : {
        x : 400,
        y : 20,
        state : 3,
        entity : 4
      }
    }

   _.forEach(testPackets, function(packet, i) {
      it('should exchange ' + i + ' packet', function(done) {
        server.on(i, function(data, client) {
          delete data.name
          data.should.be.deep.equal(packet);
          done();
        });

        client.send[i](packet);
      });
    })
  });
});