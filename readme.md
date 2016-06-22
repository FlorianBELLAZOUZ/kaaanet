KAAANET
===========
**[Working in process]**

Exchange tiny binary packets over websocket.

In mmo realtime games, we need to exchange massively packets of data between the serveurs and the clients.
The difficult part is to have a good reactivity between the seveurs and the clients with a big amout of connections.

Kaaanet help you to have this reactivity by cripting your packets to tiny ones.
And to dramaticly reduce the bandwith of yours serveurs.


What kaaanet do ?
------------

1- Your server want to send data to a client
2- Kaaanet compress this data to a binary one
3- Kaaanet send this data to the client
5- Data run on the network.
6- Kaaanet get the data
7- Kaaanet will uncompress this data.
8- Your client can use it simpely.

Get started
-------------

**1- instalation**
````js
npm i kaaanet
````

**2- Define your packets**
packets.js
````js
module.exports = Packet.create([
    {name:'player', x:Int(10), y:Int(10), stun:Int(1)},
    {name:'message', txt:Txt(100)}
])
````

**3- Define your server**
server.js
````js
    var packets = require('./packets.js')
    var server = new Server({port:8080, packets:packets})
    server.on('connection', function(client) {
        client.send.player({x:5, y:30, stun:0})
    })
````

**4- Define your client**
client.js
````js
    var packets = require('./packets.js')
    var client = new Client('ws://localhost:8080', packets)
    client.on('player', function(data) {
        console.log(data);
    });
````

RoadMap :
-------------

+optimisation
  + speed up compression of data with a c plugin
