MusicManager = {
    localStorage: null,

    init: function(options) {
        var self = this;
        if(false) {
            this._createPersistantLocalStorage(function(storage) {
                storage.retrieveAll(function(objects) {
                    for(var i in objects) {
                        self.addSong(objects[i], i);
                    }
                });
                self.localStorage = storage;
            });
        } else {
            this._createTemporaryLocalStorage(function(storage) {
                self.localStorage = storage;
            });
        }
    },
    parseFile: function(file, callback) {
        var self = this;
        try {
            var meta = musicmetadata(file); // throws if invalid file
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
                callback(song);
            });
        } catch(e) {
        }
    },
    addSong: function(file, id) {
        var self = this;
        var store = !id;
        self.parseFile(file, function(song) {
            if(id) {
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
    _createPersistantLocalStorage: function(callback) {
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
                objectStore.put(new Blob([data],{type: data.type}), id);
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
            callback(db);
        };
        store.onupgradeneeded = function (event) {
            var db = event.target.result;
            db.createObjectStore('music');
        };
    },
    _createTemporaryLocalStorage: function(callback) {
        callback({
            model: new Mongo.Collection(null),
            set: function(id, data) {
                this.model.insert({
                    _id: id,
                    url: URL.createObjectURL(data),
                });
            },
            get: function(id, callback) {
                this.getAsDataUrl(id, function(dataUrl) {
                    var request = new XMLHttpRequest();
                    request.open('GET', dataUrl, true);
                    request.responseType = 'blob';
                    request.onload = function(error) {
                        if(this.status == 200) {
                            callback(this.response);
                        }
                    }
                    request.send();
                });
            },
            getAsDataUrl: function(id, callback) {
                var song = this.model.findOne({_id: id});
                callback(song ? song.url : undefined);
            },
        });
    }
};
