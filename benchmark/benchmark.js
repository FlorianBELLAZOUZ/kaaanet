var colors = require('colors');
var Benchmark = require('benchmark');
var PacketEmitter = require('../lib/PacketEmitter');
var Int = require('../lib/Packet').Int;
var Txt = require('../lib/Packet').Txt;
var Bin = require('kaaabin');

var test = new Benchmark();

test.name = 'PacketEmitter._createBinaryWithPacket';

var packet = {
  name:'updateArenaClient',
  time: Int(40),
  newEntity: [{nametxt:Txt(11), x:Int(11), y:Int(11), id:Int(50)}, 6],
  fx: [{nametxt:Txt(11), x:Int(11), y:Int(11), id:Int(50), idTarget:Int(50)}, 6],
  kill: [{id:Int(50)}, 6],
  changeState: [{id:Int(50), type:Int(11)}, 6],
  update: [{id:Int(50), x:Int(11), y:Int(11)}, 6],
  notification: [{type:Int(4), message:Txt(20)}, 6],
  hud: [{nbKill:Int(11), isKaaarot:Int(1)}, 3],
  players: [{invisible:Int(1), type:Int(4), dir:Int(4), x:Int(11), y:Int(11)}, 3],
};

var bin = new Bin();

var data = {
  time:1020,
  newEntity : [
    {nametxt:'smoke', x:10, y:100, id:12, idTarget:12},
    {nametxt:'hat', x:10, y:100, id:12, idTarget:12},
  ],
  fx : [
    {nametxt:'smoke', x:10, y:100, id:12, idTarget:12},
  ],
  players : [
    {invisible:0, type:3, dir:4, x:100, y:100},
    {invisible:1, type:3, dir:4, x:100, y:100},
    {invisible:0, type:3, dir:4, x:100, y:100},
    {invisible:0, type:3, dir:4, x:100, y:100},
  ],
  kill:[],
  changeState:[],
  update:[],
  notification:[],
  hud:[],
}

var packetEmitter = new PacketEmitter();

test.fn = function() {
  bin = new Bin();
  packetEmitter._createBinaryWithPacket(packet, bin, data);
};

test.on('complete', showOps);

test.run();

function showOps(e) {
  console.log(String(e.target));
  console.log(e.target.name, Math.round(e.target.hz).toLocaleString().yellow, 'ops/sec');
}
