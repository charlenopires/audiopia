MusicManager = {
    localStorage: null,

    init: function() {
        this._createPersistantLocalStorage();
    },
    addSong: function(file, id) {
        var self = this;
        var meta = musicmetadata(file); // throws if invalid file
        var store = !id;
        meta.on('metadata', function(result) {
            var song = {
                'track': result.track.no,
                'title': result.title,
                'album': result.album,
                'artist': result.artist[0],
                'genre': result.genre[0],
                'year': result.year,
                'mime': file.type,
                'timestamp': new Date()
            };
            if(!store) {
                song = _.extend(song, {
                    '_id': id
                });
            }
            Meteor.call('addSong', song, store ? function(error, songId) {
                if(!error) {
                    self.localStorage.set(songId, file);
                }
            } : null);
        });
    },
    _createPersistantLocalStorage: function() {
        var self = this;
        var store = indexedDB.open('audiopia', 1);
        store.onerror = function(event) {
            console.warn('Failed to access IndexedDB');
        };
        store.onsuccess = function(event) {
            var db = this.result;
            db.set = function(id, data) {
                var transaction = this.transaction(['music'], 'readwrite');
                var objectStore = transaction.objectStore('music');
                objectStore.put(data, id);
            };
            db.get = function(id, callback) {
                var transaction = this.transaction(['music']);
                var objectStore = transaction.objectStore('music');
                objectStore.get(id).onsuccess = function(event) {
                    callback(event.target.result);
                }
            };
            db.getAsDataUrl = function(id, callback) {
                this.get(id, function(data) {
                    callback(data ? URL.createObjectURL(data) : undefined);
                });
            };
            db.retrieveAll = function(callback) {
                var transaction = this.transaction(['music']);
                var objectStore = transaction.objectStore('music');
                var objectMap = [];
                objectStore.openCursor().onsuccess = function(event) {
                    var cursor = event.target.result;
                    if(cursor) {
                        objectMap[cursor.key] = cursor.value;
                        cursor.continue();
                    } else {
                        callback(objectMap);
                    }
                };
            };
            db.clear = function() {
                var transaction = this.transaction(['music'], 'readwrite');
                var objectStore = transaction.objectStore('music');
                objectStore.clear();
            }

            self.localStorage = db;
            self.localStorage.retrieveAll(function(objects) {
                for(var i in objects) {
                    self.addSong(objects[i], i);
                }
            });
        };
        store.onupgradeneeded = function (event) {
            var db = event.target.result;
            db.createObjectStore('music');
        };
    }
};
