/*
    Import a JSON file, an array of pairs name and object
    The object hold columns as properties
    and one of the property is the content.
    A SQLite database must be converted to this format before to be loaded.
    
    Function are also added to access the content.
    
    (c) 2018 Scriptol.com - MIT License
*/

function importIDB(dname, sname, arr) {
	return new Promise(function(resolve) {
    	var r = window.indexedDB.open(dname);
		r.onupgradeneeded = function() {
		    var idb = r.result;
		    var store = idb.createObjectStore(sname, {keyPath: "name"});
		}
		r.onsuccess = function() {
			var idb = r.result;
	        let tactn = idb.transaction(sname, "readwrite");
    	    var store = tactn.objectStore(sname);
	        for(var obj of arr) {
   	        	store.put(obj);
        	}
			resolve(idb);
	    }
    	r.onerror = function (e) {
			alert("Enable to access IndexedDB, " + e.target.errorCode);
	    }    
	})
}


function displayIDB(idb, sname, id) {
    let storage = document.getElementById(id);
    let tactn = idb.transaction(sname, "readonly");
    let osc = tactn.objectStore(sname).openCursor();
    osc.onsuccess = function(e) {
        let cursor = e.target.result;
        if (cursor) {
			storage.innerHTML += "Name " + cursor.value["name"] + " : " + cursor.value["origin"] + " " + cursor.value["color"] + "<br>";
            cursor.continue();
        }
    } 
    tactn.oncomplete = function() {
        idb.close();
    };	
}


function getIDB(dname, sname, key) {
	return new Promise(function(resolve) {
		var r = indexedDB.open(dname);
   		r.onsuccess = function(e) {
			var idb = r.result;
	    	let tactn = idb.transaction(sname, "readonly");
		    let store = tactn.objectStore(sname);
    		let data = store.get(key);
		    data.onsuccess = function() {
    		    resolve(data.result);
	    	}
			tactn.oncomplete = function() {
    	    	idb.close();
	    	}
		}
	})
}
