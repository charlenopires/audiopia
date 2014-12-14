WebRTC = null;

Hooks.onLoggedIn = function(userId) {
    WebRTC = new Peer(userId, {key: '62is9f6ozx2mx6r'});
    WebRTC.on('connection', function(conn) {
        var songId = conn.metadata.song;
        conn.on('open', function() {
            MusicManager.localStorage.get(songId, function(data) {
                if(!data) {
                } else {
                    var reader = new FileReader();
                    reader.onload = (function(e) {
                        var context = new AudioContext();
                        context.decodeAudioData(e.target.result, function(buffer) {
                            var remote = context.createMediaStreamDestination();
                            var source = context.createBufferSource();
                            source.buffer = buffer;
                            source.start(0);
                            source.connect(remote);
                            WebRTC.call(conn.peer, remote.stream, {metadata:{song:songId}});
                        });
                    });
                    reader.readAsArrayBuffer(data);
                }
            });
        });
    }).on('call', function(call) {
        call.answer(null);
        call.on('stream', function(stream) {
            AudioPlayer.loadFromDataUrl(URL.createObjectURL(stream));
        });
    }).on('error', function(error) {
        console.warn(error);
        if(error.type == 'network') {
            console.warn('will try to reconnect in 5s');
            setTimeout(function() {
                WebRTC.reconnect();
            }, 5000);
        }
    }).stream = function(song) {
        var conn = this.connect(song.owner, {metadata: {song: song._id}});
        conn.on('open', function() {
            AudioPlayer.loadSong(song);
            conn.on('data', function(data) {
                var blob = new Blob([data], {
                    type: song.mime
                });
                AudioPlayer.loadFromDataUrl(URL.createObjectURL(blob));
            });
        });
    };
};

Hooks.onLoggedOut = function(userId) {
    WebRTC.destroy();
}
