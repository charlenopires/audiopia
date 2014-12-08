Template.home.helpers({
    music: function() {
        return Music.find();
    }
});

Template.home.events({
    'change input[type=file]': function(event, template) {
        var files = event.target.files;
        for(var i in files) {
            var file = files[i];
            try {
                (function(file) {
                    var meta = musicmetadata(file); // throws if invalid file
                    meta.on('metadata', function(result) {
                        Meteor.call('addSong', {
                            'track': result.track.no,
                            'title': result.title,
                            'album': result.album,
                            'artist': result.artist[0],
                            'genre': result.genre[0],
                            'year': result.year,
                            'mime': file.type,
                            'timestamp': new Date()
                        }, function(error, songId) {
                            if(!error) {
                                MusicData.insert({
                                    _id: songId,
                                    url: URL.createObjectURL(file),
                                });
                            }
                        });
                    });
                }(file));
            } catch(e) { /* ignore invalid file */ }
        }
    },
    'click ul li': function(event, template) {
        var song = this;
        var blob = MusicData.findOne({ _id: song._id});
        if(!blob) {
            var conn = WebRTC.connect(song.owner, {metadata: {song: song._id}});
            conn.on('open', function() {
                conn.on('data', function(data) {
                    var blob = new Blob([data], {
                        type: song.mime
                    });
                    var a = new Audio(URL.createObjectURL(blob));
                    a.play();
                });
            });
        }
    }
});
