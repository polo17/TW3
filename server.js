const express = require('express');
const server = express();
const dao = require('./DAO.js');
const port = 1000;
const address = "0.0.0.0";

//Pour qu'un fichier css ou js retrouve son répertoire dans le serveur:
server.use("/", express.static(__dirname + '/HTML'));
server.use("/JS", express.static(__dirname + '/JS'));
server.use("/CSS", express.static(__dirname + '/CSS'));
server.use("/IMAGES", express.static(__dirname + '/IMAGES'));

//Configurations ...
server.engine('html', require('atpl').__express);
server.set('devel', false);
server.set('view engine', 'html');
server.set('view cache', false);
server.set('views', __dirname);

var bodyParser = require('body-parser');
server.use(bodyParser.json());
server.use(bodyParser.urlencoded({ extended: false }));

async function run()
{

    server.get('/data', async function(req, res){ //Tous les points sur la carte
		ap = await dao.Carte();
		res.send(ap);
    });
	
	server.get('/data2',async function(req, res){
		aa = await dao.AllAnn("radars");
		res.send(aa);
    });
	
	server.get('/data3',async function(req, res){
		adt = await dao.AllDep("radars");
		res.send(adt);
    });
	
	server.get('/data4',async function(req, res){
		av = await dao.AllVit("radars");
		res.send(av);
    });

    server.listen(port, address, function() {
        console.log('Port n°  ' + port);
    });
	
	server.get('/Ajout.html', function(req, res){
		res.render('form');
		res.sendFile("Ajout.html");
	});
	
    server.post('/Ajout.html', function(req, res){
      var nom = req.body.nom;
      var date = req.body.datei;
      var type = req.body.type;
	  var vit = req.body.vit;
		var coorx = req.body.coorx;
		var coory = req.body.coory;
	  var coor = [coorx, coory];
      var dep = req.body.dep;
      var ville = req.body.ville;
      var rue = req.body.rue;
	  
	  dao.AjoutRadar(nom, date, type, vit, coor, dep, ville, rue);
	  
      res.status(204).send();
    });
	
	server.get('/suppr.html', function(req, res){
		res.render('form');
		res.sendFile("suppr.html");
	});
	
	server.post('/suppr.html', function(req, res){
      var nom = req.body.nom;
      var date = req.body.datei;
		var coorx = req.body.coorx;
		var coory = req.body.coory;
	  var coor = [coorx, coory];
      var rue = req.body.rue;
	  
	  dao.SupprRadar(nom, date, coor, rue);
	  
      res.status(204).send();
    });
	
	server.get('/modif.html', function(req, res){
		res.render('form');
		res.sendFile("modif.html");
	});
	
    server.post('/modif.html', function(req, res){
      var nom = req.body.nom;
      var date = req.body.datei;
      var type = req.body.type;
	  var vit = req.body.vit;
		var coorx = req.body.coorx;
		var coory = req.body.coory;
	  var coor = [coorx, coory];
      var dep = req.body.dep;
      var ville = req.body.ville;
      var rue = req.body.rue;
	  
	  dao.ModifRadar(nom, date, type, vit, coor, dep, ville, rue);
	  
      res.status(204).send();
    });

}

run();