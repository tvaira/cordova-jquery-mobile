// cf. http://diveintohtml5.info/storage.html
// Non utilisé

function supportsLocalStorage() {
  try {
    return 'localStorage' in window && window['localStorage'] !== null;
  } catch (e) {
    return false;
  }
}

function supportsJSON() {
  try {
    return 'JSON' in window && window['JSON'] !== null;
  } catch (e) {
    return false;
  }
}

function addToStorage(id,label) {
    if (!hasInStorage(id)) {
        var data = getStorage();
        data[id] = label;
        saveStorage(data);
    }
}	

function getStorage() {
    var current = window.localStorage["fiches"];
    var data = {};
    if(typeof current != "undefined") data = window.JSON.parse(current);
    return data;
}

function hasInStorage(id) {
    return (id in getStorage());
}		

function removeFromStorage(id,label) {
    if (hasInStorage(id)) {
        var data = getStorage();
        delete data[id];
        console.log('removeFromStorage ' + id);
        saveStorage(data);
    }
}	

function saveStorage(data) {
    console.log("saveStorage");
    console.dir(data);
    localStorage["fiches"] = window.JSON.stringify(data);
}
