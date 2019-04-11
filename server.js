const express = require('express');

const server = express();

const dao = require('./DAO.js');

const port = 3000;

const address = "0.0.0.0";


server.use("/", express.static(__dirname + '/static'));

//server.use("/js", express.static(__dirname + '/js'));

server.use(".././data", express.static(__dirname + '../data'));



server.engine('html', require('atpl').__express);

server.set('devel', false);

server.set('view engine', 'html');

server.set('view cache', false);

server.set('views', __dirname);


async function run()

{

    var mc = await dao.AllTable("radars");
	
	console.log(mc);

    server.get('/data', function(req, res){

      res.send(mc);

    });


    server.listen(port, address, function() {

        console.log('Listening to port:  ' + port);

    });

}

run();