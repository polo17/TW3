//Connection à la base de données

module.exports = {
    DAO: function(bdd_name) {
        return new Promise(resolve => {
            setTimeout(() => {
                var MongoClient = require('mongodb').MongoClient;				
                var uri = "mongodb+srv://ltourn:.Ludo81.%21%21%3Fazert@radars-ndadt.mongodb.net/test?retryWrites=true";
				//var uri = "mongodb://localhost:27017/radars-occitanie";					
                var client = new MongoClient(uri, { useNewUrlParser: true });				
                client.connect(err => {
                    var bdd = client.db("radars-occitanie").collection("radars");
                    console.log("Connection à " + bdd_name);
                    resolve([bdd,client]);
                });
            }, 1000);
        });
    },



    Carte: async function() { //Envoi de tous les points sur la carte

        var bdd_client = await module.exports.DAO("radars");
        var bdd = bdd_client[0];
        var client = bdd_client[1];
        var query = {};
        const cursor = await bdd.find(query);
        var tab = [];
        while(await cursor.hasNext())

        {
          const doc = await cursor.next();
          tab.push( { x : doc.coordonees[0], y :  doc.coordonees[1], dep : doc.departement, typ : doc.type, nom : doc.nom, dat : doc.date, rue : doc.rue, vil : doc.ville } );
        }

        client.close();

        return new Promise(resolve => {
            setTimeout(() => {
                    resolve(tab);
                });
            }, 0);
    },



    AllDep: async function(bdd_name) { //Envoi du nombre de tous les radars par département et par type

        var bdd_client = await module.exports.DAO(bdd_name);
        var bdd = bdd_client[0];
        var client = bdd_client[1];
		
        var query = {};
        const cursor = await bdd.find(query);
        var dep = []; //Tableau des départements
		
        while(await cursor.hasNext())

        {
          const doc = await cursor.next();
		  if (! dep.includes(doc.departement)) dep.push(doc.departement);
        }
			
		var tab = [];	
		
		for (var d = 0 ; d < dep.length ; d++){
			 		
			var vit = 0;
			var feux = 0;
			var voie = 0;	
			
			var query = { "departement" : dep[d]};
			const cursor = await bdd.find(query);
		
			while(await cursor.hasNext())
			{
				const doc = await cursor.next();
				if ((doc.type).substring(0,22) == "Franchissement de voie") {
					voie = voie + 1;
				}
				else if (doc.type == "Franchissement de feux"){
					feux = feux + 1;
				}
				else {
					vit = vit + 1;
				}
				
			}
			tab.push( { dep : dep[d] , vit : vit , feu : feux , voi : voie } );
		}

        client.close();

        return new Promise(resolve => {
            setTimeout(() => {
                    resolve(tab);
                });
            }, 0);
    },
	
    AllAnn: async function(bdd_name) { //Envoi de tous les nombres de radars par années
		
		var bdd_client = await module.exports.DAO(bdd_name);
        var bdd = bdd_client[0];
        var client = bdd_client[1];
		
        var query = {};
        const cursor = await bdd.find(query);
		
        var annees = [];
		
        while(await cursor.hasNext())

        {
          const doc = await cursor.next();
		  var ann = (doc.date).slice(0, 4)
		  if (! annees.includes(ann)) annees.push(ann);
        }
		
		var tab = [];	
		
		for (var a = 0 ; a < annees.length ; a++){
			
			var nbr = 0;
			
			var query = { "date" : { '$regex' : annees[a] } };
			const cursor = await bdd.find(query);
		
			while(await cursor.hasNext())
			{
				const doc = await cursor.next();
				nbr = nbr + 1;
			}
			tab.push( { ann : annees[a] , cpt : nbr } );
		}

        client.close();

        return new Promise(resolve => {
            setTimeout(() => {
                    resolve(tab);
                });
            }, 0);
    },
	
	AllVit: async function(bdd_name) { //Envoi de tous les nombres de radars par vitesse
		
		var bdd_client = await module.exports.DAO(bdd_name);
        var bdd = bdd_client[0];
        var client = bdd_client[1];
		
        var vitesses = ["50","70","80","90","110","130"];
		
		var tab = [];
		
		for (var v = 0 ; v < vitesses.length ; v++){			
			var nbr = 0;			
			var query = { "vitesse" : vitesses[v] };
			const cursor = await bdd.find(query);
			
			while(await cursor.hasNext())
				{
					const doc = await cursor.next();
					nbr = nbr + 1;
				}
				tab.push( { vit : vitesses[v] , cpt : nbr } );
			}
		

        client.close();

        return new Promise(resolve => {
            setTimeout(() => {
                    resolve(tab);
                });
            }, 0);
    },
	
	AjoutRadar: async function(nom, date, type, vit, coor, dep, ville ,rue) { //Ajout d'un radar

        var bdd_client = await module.exports.DAO("radars");
        var bdd = bdd_client[0];
        var client = bdd_client[1];
		if (type == "Vitesse"){
			ntype = type + " VL " + vit;
		}
		else if (type == "Franchissement de voie"){
			ntype = type + " ferrée";
		}
		else {
			ntype = type;
		}
        var query = {nom : nom, date : date, type : ntype, vitesse : vit, coordonees : coor, departement : dep, ville : ville, rue : rue};
        const cursor = await bdd.insertOne(query);
		console.log("Radar ajouté avec succès");
        client.close();
    },
	
	SupprRadar: async function(nom, date, coor, rue) { //Suprression d'un radar
        var bdd_client = await module.exports.DAO("radars");
        var bdd = bdd_client[0];
        var client = bdd_client[1];
		if (nom == ""){
			if (date == ""){
				if (coor ==["",""]){
					if(rue ==""){
						console.log("Problème suppr");
					}
					else{
						var query = {rue : rue};
					}
				}
				else{
					var query = { coordonees : coor };
				}
			}
			else{
				var query = { date : date };
			}
		}
		else{
			var query = { nom : nom };
		}
        const cursor = await bdd.deleteOne(query);
		console.log("Supprimé");
        client.close();
    },
	
	ModifRadar: async function(nom, date, type, vit, coor, dep, ville ,rue) { //Modification d'un radar
        var bdd_client = await module.exports.DAO("radars");
        var bdd = bdd_client[0];
        var client = bdd_client[1];
		
		var query = {nom : nom};
        const cursor = await bdd.find(query);	
        while(await cursor.hasNext())

        {
          const doc = await cursor.next();
		  var datea = doc.date; var typea = doc.type; var vita = doc.vitesse; var coora = doc.coordonees;
		  var depa = doc.departement; var villea = doc.ville; var ruea = doc.rue;
        }
		if (date != "") datea = date;
		if (vit != "") vita = vit;
		if (coor[0] != "") coora[0] = coor[0];
		if (coor[1] != "") coora[1] = coor[1];
		if (dep != "") depa = dep;
		if (ville != "") villea = ville;
		if (rue != "") ruea = rue;
		if (type != ""){
			if (type == "Vitesse"){
				typea = type + " VL " + vita;
			}
			else if (type == "Franchissement de voie"){
				typea = type + " ferrée";
			}
			else {
				typea = type;
			}
		}
		
		bdd.updateOne(
			{ nom: nom },
			{ $set: { nom : nom, date : datea, type : typea, vitesse : vita, coordonees : coora, departement : depa, ville : villea, rue : ruea} }
		);
		console.log("Radar modifié avec succès");
        client.close();
    },

}

