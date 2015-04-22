#!/usr/bin/env node

var net = require('net');
var allContainers = require('docker-allcontainers');
var loghose = require("docker-loghose");
var program = require('commander');
var through = require('through2');
var os = require("os");

program
  .version('0.1.0')
  .option('-h, --host [host]', 'LogIo server host', 'localhost')
  .option('-p, --port [port]', 'LogIo server port', 28777)
  .option('-n, --name [name]', 'LogIo node name', os.hostname())
  .parse(process.argv);



function connect() {
  var stream = net.createConnection(program.port, program.host);
  return stream;
}
var s = connect();

var ee = allContainers({
  preheat: true,
  docker: null,
});

var opts = {
  json: false,
  docker: null,
  events: ee
};
loghose(opts).pipe(through.obj(function(chunk, enc, cb){
  this.push('+log|'+chunk.image+'|'+program.name+':'+chunk.id+'|info|'+chunk.line+'\r\n');
  cb();
})).pipe(s);

ee.on('start', function(meta, container) {
  var id = meta.id.substring(0, 12);
  s.write('+node|'+program.name+':'+id+'|'+meta.image+'\r\n');
});
ee.on('stop', function(meta, container) {
  var id = meta.id.substring(0, 12);
  s.write('-node|'+program.name+':'+id+'\r\n');
});
