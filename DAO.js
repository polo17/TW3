module.exports = {

    DAO: function(bdd_name) {

        return new Promise(resolve => {

            setTimeout(() => {

                var MongoClient = require('mongodb').MongoClient;

                var uri = "mongodb://localhost:27017/";

                var client = new MongoClient(uri, { useNewUrlParser: true });

                client.connect(err => {


                    var bdd = client.db("radars-occitanie").collection("radars");

                    console.log("Connection to MongoDB Atlas DataBase radars succefull for " + bdd_name);

                    resolve([bdd,client]);

                });

            }, 0);

        });

    },



    AllTable: async function(bdd_name) {

        var bdd_client = await module.exports.DAO(bdd_name);

        var bdd = bdd_client[0];

        var client = bdd_client[1];

        var query = {};

        const cursor = await bdd.find(query);

        var tab = [];

        var result = "";



        while(await cursor.hasNext())

        {

          const doc = await cursor.next();

          // String with Longitude,Latitude

          result+= doc.coordonees[0] + "," + doc.coordonees[1];

          // Object with Longitude: , Latitude:

          tab.push({x: doc.coordonees[0], y:  doc.coordonees[1]});

        }

        // Deleting the last ',' from the String

        result.slice(0,-1);


        // Do not forget to close the connection

        client.close();

        //console.log(tab);



        return new Promise(resolve => {

            setTimeout(() => {

                    resolve(tab);

                });

            }, 0);

    },



    AllObesity: async function(bdd_name) {

        var bdd_client = await module.exports.DAO(bdd_name);

        var bdd = bdd_client[0];

        var client = bdd_client[1];

        var query = {};

        const cursor = await bdd.find(query);



        var tab = [];

        var result = "";



        while(await cursor.hasNext())

        {

          const doc = await cursor.next();

          // String with Longitude,Latitude

          result+= doc.State + "," + doc.Value + ",";

          // Object with Longitude: , Latitude:

          tab.push({State: doc.State, Value: doc.Value});

        }

        // Deleting the last ',' from the String

        result.slice(0,-1);



        // Do not forget to close the connection

        client.close();



        //console.log(tab);



        return new Promise(resolve => {

            setTimeout(() => {

                    resolve(result);

                });

            }, 0);

    },



    AllFastFoodNumber: async function(bdd_name) {

        var bdd_client = await module.exports.DAO(bdd_name);

        var bdd = bdd_client[0];

        var client = bdd_client[1];

        var query = {};

        const cursor = await bdd.find(query);



        var tab = [];

        var result = "";



        while(await cursor.hasNext())

        {

          const doc = await cursor.next();

          // String with Longitude,Latitude

          result+= doc.State + "," + doc.Quantity + ",";

          // Object with Longitude: , Latitude:

          tab.push({State: doc.State, Quantity: doc.Quantity});

        }

        // Deleting the last ',' from the String

        result.slice(0,-1);



        // Do not forget to close the connection

        client.close();



        //console.log(tab);



        return new Promise(resolve => {

            setTimeout(() => {

                    resolve(result);

                });

            }, 0);

    },



    // Test method for DAO

    Test: async function() {

        var mc = await module.exports.AllTable("Macdonald's");

        var bk = await module.exports.AllTable("Burger King's");

        console.log(mc);

        console.log(bk);

    }

}

