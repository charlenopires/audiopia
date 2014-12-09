MusicManager = {
    addSong: function(file) {
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
    }
};

