// publicPacket.js
var packet = require('kaaanet').packet;

var alpha = packet.create([
  {
    name:'close'
  },
  {
    name:'profile',
    id:string(60),
    pseudo:string(20),
    lvl:integral(10),
    type:string(3)
  },
  {
    name:'input',
    type:string(3),
    space:integral(1),
    key:arrayString(3),
    mana:arrayObject({
      type:string(4),
      nice:string(3),
    })
  }
]);

packetBeta.init([
  {
    name:'createAComplexeValue',
    nice:string(3)
  }
], alpha); // heritage de packet

packetBeta.extend(alpha); // override same name

exports.module = alpha;


// server.js
var publicPacket = require('./publicPacket.js');
var Server = require('kaaanet').Server;

var server = new Server({port:8080,packets:publicPackets})
server.initPackets(publicPackets);

server.on('connection', function(client) {
  client.send.input({type:'feu', space:true, key:['bla','foo','bee']});
  client.send.close();

  client.on('input', input)
  client.get.input({type:'feu'}, inputGet);
});

server.on('close', function(data client) {});

server.send.close();
server.send.input({type:32,space:true});

function input(data, client) {
  if(data.type == 'feu'){ }

  client.send.close();
}

function inputGet(data, client) {
  if(data.type == 'ok')
  this.clientsFeu.push(client);
}


// function sendTo(){
//  server.room('nice').send.close();
//  server.room('nice').state = 'ready';
// }

// client.goRoom('nice')

// server.room('cool').send.close();
// server.room('cool').get.size({}, function(data, client) {});
// server.room('cool').id(0).send.close();

// client.js

var publicPacket = require('./publicPacket.js');
var client = new Client('ws://localhost:7878',publicPacket);
client.initPacket(publicPacket);

client.send.close();
client.send.input({x:10,y:40,z:40});

client.on('input', function(data){
  this.send.input({x:10,y:40,z:34});
});

client.get.profile(function(data){
  save.data = data;
});

client.get.profile({id:30}, function(data){
  save.data = data;
});

//////////////////////////////////

packet.init
