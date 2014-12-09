WebRTC = null;

Hooks.onLoggedIn = function(userId) {
    WebRTC = new Peer(userId, {key: '62is9f6ozx2mx6r'});
    WebRTC.on('connection', function(conn) {
        var songId = conn.metadata.song;
        conn.on('open', function() {
            var data = MusicData.findOne({_id: songId});
            if(!data) {
            } else {
                var request = new XMLHttpRequest();
                request.open('GET', data.url, true);
                request.responseType = 'blob';
                request.onload = function(error) {
                    if(this.status == 200) {
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
                        reader.readAsArrayBuffer(this.response);
                    }
                }
                request.send();
            }
        });
    }).on('call', function(call) {
        call.answer(null);
        call.on('stream', function(stream) {
            var dataUrl = URL.createObjectURL(stream);
            var player = new Audio(dataUrl);
            player.play();
        });
    }).on('error', function(error) {
        console.warn(error);
        if(error.type == 'network') {
            console.warn('will try to reconnect in 5s');
            setTimeout(function() {
                WebRTC.reconnect();
            }, 5000);
        }
    }).stream = function(audio, song) {
        var conn = this.connect(song.owner, {metadata: {song: song._id}});
        conn.on('open', function() {
            conn.on('data', function(data) {
                var blob = new Blob([data], {
                    type: song.mime
                });
                audio.src = URL.createObjectURL(blob);
            });
        });
    };
};

Hooks.onLoggedOut = function(userId) {
    WebRTC.destroy();
}
