var Client = require('../../lib/Client');
var Should = require('chai').Should();

describe('Client', function () {
  var client = new Client('ws://localhost',{});

  it('should expose that API', function(){
    client.close.should.exist;
    client.reconnection.should.exist;
    client.send.should.exist;
    client.on.should.exist;
    client.initPackets.should.exist;
    client.extendPackets.should.exist;
    client.removeListener.should.exist;
  })
});

describe('Packet', function() {
  it('should expose that API', function(){
    Client.Packet.create.should.exist;
    Client.Packet.Txt.should.exist;
    Client.Packet.Int.should.exist;
    Client.Packet.ArrayTxt.should.exist;
    Client.Packet.ArrayInt.should.exist;
  })
});
