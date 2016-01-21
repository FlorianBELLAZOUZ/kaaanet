var packet = {
	name:"name",
}

// give a data structure that client and serveur will use
function create(packets){
  return packets;
}

function Int(bit){}
function String(size){}
function ArrayInt(bit,arraySize){}
function ArrayString(bit,arraySize){}

module.exports = create;
module.exports.create = create;